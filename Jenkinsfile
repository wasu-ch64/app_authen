pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = "wasu1304"
    IMAGE_CLIENT = "${DOCKER_REGISTRY}/app_authen_client:latest"
    IMAGE_SERVER = "${DOCKER_REGISTRY}/app_authen_server:latest"
  }

  tools {
    sonarQubeScanner 'sonar-scan'
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQubeServer') {
          sh 'sonar-scanner'
        }
      }
    }

    stage('Docker Login') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
      }
    }

    stage('Build Client Docker Image') {
      steps {
        dir('client') {
          sh "docker build -t ${IMAGE_CLIENT} ."
        }
      }
    }

    stage('Build Server Docker Image') {
      steps {
        dir('server') {
          sh "docker build -t ${IMAGE_SERVER} ."
        }
      }
    }

    stage('Push Docker Images') {
      steps {
        sh "docker push ${IMAGE_CLIENT}"
        sh "docker push ${IMAGE_SERVER}"
      }
    }
  }
}
