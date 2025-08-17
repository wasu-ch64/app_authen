pipeline {
    agent any

    environment {
        DOCKER_USER = "wasu1304"
        DOCKER_REGISTRY = "docker.io"
        NAMESPACE = "app-authen"
        GIT_REPO = "https://github.com/wasu-ch64/app_authen.git"
        ARGO_REPO_PATH = "k8s"
        ARGO_AUTH_TOKEN = credentials('ARGO_AUTH_TOKEN')
        ARGO_APP_NAME = "app-authen"
        ARGO_NAMESPACE = "argocd"
        // ARGO_SERVER = "argocd-server.${ARGO_NAMESPACE}.svc.cluster.local:443" // เปลี่ยนจาก localhost:8080
        ARGO_SERVER = "localhost:8080"
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
                    env.BACKEND_IMAGE_COMMIT = "${DOCKER_REGISTRY}/${DOCKER_USER}/backend:${COMMIT_HASH}"
                    env.BACKEND_IMAGE_LATEST = "${DOCKER_REGISTRY}/${DOCKER_USER}/backend:latest"
                    env.FRONTEND_IMAGE_COMMIT = "${DOCKER_REGISTRY}/${DOCKER_USER}/frontend:${COMMIT_HASH}"
                    env.FRONTEND_IMAGE_LATEST = "${DOCKER_REGISTRY}/${DOCKER_USER}/frontend:latest"
                }
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials',
                                                 usernameVariable: 'DOCKER_USERNAME',
                                                 passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh 'docker login -u $DOCKER_USERNAME -p $DOCKER_PASSWORD ${DOCKER_REGISTRY}'
                }
            }
        }

        stage('Build & Push Backend Docker') {
            steps {
                sh '''
                docker build -t ${BACKEND_IMAGE_LATEST} -t ${BACKEND_IMAGE_COMMIT} ./backend
                docker push ${BACKEND_IMAGE_LATEST}
                docker push ${BACKEND_IMAGE_COMMIT}
                # ตรวจสอบว่า image push สำเร็จ
                docker manifest inspect ${BACKEND_IMAGE_COMMIT} || exit 1
                '''
            }
        }

        stage('Build & Push Frontend Docker') {
            steps {
                sh '''
                docker build -t ${FRONTEND_IMAGE_LATEST} -t ${FRONTEND_IMAGE_COMMIT} ./frontend
                docker push ${FRONTEND_IMAGE_LATEST}
                docker push ${FRONTEND_IMAGE_COMMIT}
                # ตรวจสอบว่า image push สำเร็จ
                docker manifest inspect ${FRONTEND_IMAGE_COMMIT} || exit 1
                '''
            }
        }

        stage('Update Manifests for Argo CD') {
            steps {
                sh '''
                sed -i "s|image: .*backend.*|image: ${BACKEND_IMAGE_COMMIT}|" ${ARGO_REPO_PATH}/backend.yaml
                sed -i "s|image: .*frontend.*|image: ${FRONTEND_IMAGE_COMMIT}|" ${ARGO_REPO_PATH}/frontend.yaml
                # ตรวจสอบว่า manifest อัพเดทถูกต้อง
                cat ${ARGO_REPO_PATH}/backend.yaml
                cat ${ARGO_REPO_PATH}/frontend.yaml
                '''
            }
        }

        stage('Push to Git for Argo CD') {
            steps {
                withCredentials([string(credentialsId: 'github-token', variable: 'GITHUB_TOKEN')]) {
                    sh '''
                    git config user.email "jenkins@example.com"
                    git config user.name "jenkins"
                    git add ${ARGO_REPO_PATH}
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
                # ใช้ ARGO_SERVER แทน localhost
                argocd login ${ARGO_SERVER} --grpc-web --auth-token $ARGO_AUTH_TOKEN
                argocd app sync ${ARGO_APP_NAME} --grpc-web --timeout 300
                # รอให้ sync เสร็จ
                argocd app wait ${ARGO_APP_NAME} --health --timeout 300 --grpc-web
                '''
            }
        }

        stage('Verify') {
            steps {
                sh '''
                kubectl get pods -n ${NAMESPACE} -o wide
                kubectl get svc -n ${NAMESPACE}
                kubectl get ingress -n ${NAMESPACE}
                # ตรวจสอบว่า pod frontend ทำงาน
                kubectl wait --for=condition=Ready pod -l app=frontend -n ${NAMESPACE} --timeout=120s
                # ทดสอบการเข้าถึง frontend
                curl -f http://$(kubectl get svc frontend -n ${NAMESPACE} -o jsonpath='{.spec.clusterIP}'):80 || echo "Frontend not accessible"
                '''
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
        failure {
            echo 'Pipeline failed! Check logs for details.'
        }
    }
}