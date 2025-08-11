pipeline {
    agent any

    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub-credentials')
        DOCKERHUB_USER = 'wasu1304'
        IMAGE_TAG = "${env.BUILD_NUMBER}"
        MANIFEST_REPO = 'git@github.com:wasu-ch64/app_authen-deploy.git'
        MANIFEST_CREDENTIALS = 'github-token'
    }

    stages {
        stage('Checkout Source') {
            steps {
                git branch: 'main',
                    credentialsId: 'github-token',
                    url: 'https://github.com/wasu-ch64/app_authen.git'
            }
        }

        stage('Build & Push Backend Image') {
            steps {
                dir('backend') {
                    sh """
                    docker build -t $DOCKERHUB_USER/server:$IMAGE_TAG .
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
                    docker push $DOCKERHUB_USER/server:$IMAGE_TAG
                    """
                }
            }
        }

        stage('Build & Push Frontend Image') {
            steps {
                dir('frontend') {
                    sh """
                    docker build -t $DOCKERHUB_USER/client:$IMAGE_TAG .
                    echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_USER --password-stdin
                    docker push $DOCKERHUB_USER/client:$IMAGE_TAG
                    """
                }
            }
        }

        stage('Update Manifests for ArgoCD') {
            steps {
                dir('manifests') {
                    git branch: 'main',
                        credentialsId: MANIFEST_CREDENTIALS,
                        url: MANIFEST_REPO

                    sh """
                    sed -i 's|image: ${DOCKERHUB_USER}/server:.*|image: ${DOCKERHUB_USER}/server:${IMAGE_TAG}|' k8s/backend.yaml
                    sed -i 's|image: ${DOCKERHUB_USER}/client:.*|image: ${DOCKERHUB_USER}/client:${IMAGE_TAG}|' k8s/frontend.yaml
                    git config user.email "jenkins@ci"
                    git config user.name "Jenkins CI"
                    git commit -am "chore: update images to tag ${IMAGE_TAG}"
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
