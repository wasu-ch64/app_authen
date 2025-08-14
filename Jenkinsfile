pipeline {
    agent any

    environment {
        BACKEND_IMAGE = "backend/backend:latest"
        FRONTEND_IMAGE = "frontend/frontend:latest"
        NAMESPACE = "app-authen"
    }

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/wasu-ch64/app_authen.git',
                    credentialsId: 'github-token'
            }
        }

        stage('Setup Minikube Docker') {
            steps {
                script {
                    // ใช้ Docker daemon ของ Minikube เพื่อไม่ต้อง push ภาพ
                    sh "eval \$(minikube -p minikube docker-env)"
                }
            }
        }

        stage('Build Backend Docker') {
            steps {
                script {
                    sh "docker build -t ${BACKEND_IMAGE} ./backend"
                }
            }
        }

        stage('Build Frontend Docker') {
            steps {
                script {
                    sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                script {
                    // สร้าง namespace ถ้ายังไม่มี
                    sh "kubectl create namespace ${NAMESPACE} || echo 'namespace exists'"

                    // apply Secret และ resource อื่น ๆ
                    sh "kubectl apply -f k8s/postgres-secret.yaml -n ${NAMESPACE}"
                    sh "kubectl apply -f k8s/postgres.yaml -n ${NAMESPACE}"
                    sh "kubectl apply -f k8s/backend.yaml -n ${NAMESPACE}"
                    sh "kubectl apply -f k8s/frontend.yaml -n ${NAMESPACE}"
                    sh "kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}"
                }
            }
        }

        stage('Verify') {
            steps {
                script {
                    sh "kubectl get pods -n ${NAMESPACE}"
                    sh "kubectl get svc -n ${NAMESPACE}"
                    sh "kubectl get ingress -n ${NAMESPACE}"
                }
            }
        }
    }
}
