pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')  // Docker Hub username/password
        DOCKERHUB_USER = 'wasu1304'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        MANIFEST_REPO = 'https://github.com/wasu-ch64/app_authen.git'
        MANIFEST_CREDENTIALS = 'github-token' // Jenkins Credential (Username + PAT)
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'main',
                    credentialsId: MANIFEST_CREDENTIALS,
                    url: MANIFEST_REPO
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                dir('backend') {
                    sh """
                        echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
                        docker build -t $DOCKERHUB_USER/backend:$IMAGE_TAG .
                        docker push $DOCKERHUB_USER/backend:$IMAGE_TAG
                    """
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                dir('frontend') {
                    sh """
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
                    docker build -t $DOCKERHUB_USER/frontend:$IMAGE_TAG .
                    docker push $DOCKERHUB_USER/frontend:$IMAGE_TAG
                    """
                }
            }
        }

        stage('Update Manifests for ArgoCD') {
            steps {
                withCredentials([usernamePassword(credentialsId: MANIFEST_CREDENTIALS, usernameVariable: 'GIT_USER', passwordVariable: 'GIT_PASS')]) {
                    sh """
                    sed -i'' -e 's|image: ${DOCKERHUB_USER}/backend:.*|image: ${DOCKERHUB_USER}/backend:${IMAGE_TAG}|' k8s/backend/deployment.yaml
                    sed -i'' -e 's|image: ${DOCKERHUB_USER}/frontend:.*|image: ${DOCKERHUB_USER}/frontend:${IMAGE_TAG}|' k8s/frontend/deployment.yaml

                    git config user.email "jenkins@ci"
                    git config user.name "Jenkins CI"

                    # ตั้ง remote url ใหม่ใส่ username กับ token สำหรับ push ผ่าน HTTPS
                    git remote set-url origin https://${GIT_USER}:${GIT_PASS}@github.com/wasu-ch64/app_authen.git

                    git add k8s/backend/deployment.yaml k8s/frontend/deployment.yaml
                    git commit -m "chore: update images to tag ${IMAGE_TAG}" || echo "No changes to commit"
                    git push origin main
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ Build completed and manifests updated for ArgoCD sync!'
        }
        failure {
            echo '❌ Pipeline failed!'
        }
    }
}
