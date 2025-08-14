pipeline {
    agent any

    environment {
        DOCKER_USER = "wasu1304"
        NAMESPACE = "app-authen"
        GIT_REPO = "https://github.com/wasu-ch64/app_authen.git"
        ARGO_REPO_PATH = "k8s"
        ARGO_APP_NAME = "app-authen"
        ARGO_NAMESPACE = "argocd"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: "${GIT_REPO}",
                    credentialsId: 'github-token'
                script {
                    COMMIT_HASH = sh(script: 'git rev-parse --short HEAD', returnStdout: true).trim()
                    if (!COMMIT_HASH) {
                        error "COMMIT_HASH is empty!"
                    }
                    env.BACKEND_IMAGE_COMMIT = "${DOCKER_USER}/backend:${COMMIT_HASH}"
                    env.BACKEND_IMAGE_LATEST = "${DOCKER_USER}/backend:latest"
                    env.FRONTEND_IMAGE_COMMIT = "${DOCKER_USER}/frontend:${COMMIT_HASH}"
                    env.FRONTEND_IMAGE_LATEST = "${DOCKER_USER}/frontend:latest"
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
                                                 usernameVariable: 'DOCKER_USERNAME',
                                                 passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD'
                }
            }
        }

        stage('Build & Push Backend Docker') {
            steps {
                sh '''
                docker build -t ${BACKEND_IMAGE_LATEST} -t ${BACKEND_IMAGE_COMMIT} ./backend
                docker push ${BACKEND_IMAGE_LATEST}
                docker push ${BACKEND_IMAGE_COMMIT}
                '''
            }
        }

        stage('Build & Push Frontend Docker') {
            steps {
                sh '''
                docker build -t ${FRONTEND_IMAGE_LATEST} -t ${FRONTEND_IMAGE_COMMIT} ./frontend
                docker push ${FRONTEND_IMAGE_LATEST}
                docker push ${FRONTEND_IMAGE_COMMIT}
                '''
            }
        }

        stage('Update Manifests for Argo CD') {
            steps {
                sh '''
                sed -i 's|image: .*backend.*|image: ${BACKEND_IMAGE_COMMIT}|' k8s/backend.yaml
                sed -i 's|image: .*frontend.*|image: ${FRONTEND_IMAGE_COMMIT}|' k8s/frontend.yaml
                '''
            }
        }

        stage('Push to Git for Argo CD') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                    git config user.email "jenkins@example.com"
                    git config user.name "jenkins"
                    git add k8s
                    if ! git diff --cached --quiet; then
                        git commit -m "Update images to ${COMMIT_HASH} for Argo CD"
                        git push https://$GITHUB_TOKEN@github.com/wasu-ch64/app_authen.git main
                    else
                        echo "No changes to commit"
                    fi
                    '''
                }
            }
        }

        stage('Trigger Argo CD Sync') {
            steps {
                sh '''
                argocd app sync ${ARGO_APP_NAME} \
                    --server argocd-server.${ARGO_NAMESPACE}.svc.cluster.local \
                    --auth-token $ARGO_AUTH_TOKEN
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                kubectl get pods -n ${NAMESPACE}
                kubectl get svc -n ${NAMESPACE}
                kubectl get ingress -n ${NAMESPACE}
                '''
            }
        }
    }
}
