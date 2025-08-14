pipeline {
    agent {
        kubernetes {
            label 'jenkins-jenkins-agent'
            defaultContainer 'docker'
        }
    }

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

        stage('Build Backend Docker') {
            steps {
                sh "docker build -t ${BACKEND_IMAGE} ./backend"
            }
        }

        stage('Build Frontend Docker') {
            steps {
                sh "docker build -t ${FRONTEND_IMAGE} ./frontend"
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh "kubectl create namespace ${NAMESPACE} || echo 'namespace exists'"
                sh "kubectl apply -f k8s/postgres-secret.yaml -n ${NAMESPACE}"
                sh "kubectl apply -f k8s/postgres.yaml -n ${NAMESPACE}"
                sh "kubectl apply -f k8s/backend.yaml -n ${NAMESPACE}"
                sh "kubectl apply -f k8s/frontend.yaml -n ${NAMESPACE}"
                sh "kubectl apply -f k8s/ingress.yaml -n ${NAMESPACE}"
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
