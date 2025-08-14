pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "wasu1304/backend:latest"
        FRONTEND_IMAGE = "wasu1304/frontend:latest"
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
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', 
                                                 usernameVariable: 'DOCKER_USER', 
                                                 passwordVariable: 'DOCKER_PASS')]) {
                    sh 'docker login -u $DOCKER_USER -p $DOCKER_PASS'
                }
            }
        }


        stage('Build Backend Docker') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE} ./backend"
                sh "docker push ${BACKEND_IMAGE}"
            }
        }

        stage('Build Frontend Docker') {
            steps {
                sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
                sh "docker push ${FRONTEND_IMAGE}"
            }
        }

        stage('Update Manifests for Argo CD') {
            steps {
                // ใช้ sed หรือ yq เปลี่ยน image ใน manifests
                sh """
                sed -i 's|image: .*backend.*|image: ${BACKEND_IMAGE}|' k8s/backend.yaml
                sed -i 's|image: .*frontend.*|image: ${FRONTEND_IMAGE}|' k8s/frontend.yaml
                """
            }
        }

        stage('Push to Git for Argo CD') {
            steps {
                sh """
                git config user.email "wasuchailangka0@.com"
                git config user.name "wasu"
                git add k8s
                git commit -m "Update images for Argo CD"
                git push origin main
                """
            }
        }

        stage('Trigger Argo CD Sync') {
            steps {
                // Argo CD CLI ต้องติดตั้งใน Jenkins Pod
                sh "argocd app sync ${ARGO_APP_NAME} --server argocd-server.${ARGO_NAMESPACE}.svc.cluster.local --auth-token \$ARGO_AUTH_TOKEN"
            }
        }

        stage('Verify') {
            steps {
                sh "kubectl get pods -n ${NAMESPACE}"
                sh "kubectl get svc -n ${NAMESPACE}"
                sh "kubectl get ingress -n ${NAMESPACE}"
            }
        }
    }
}
