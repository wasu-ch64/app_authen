pipeline {
  agent any

  environment {
    DOCKER_IMAGE_CLIENT = "myrepo/app_authen_client:latest"
    DOCKER_IMAGE_SERVER = "myrepo/app_authen_server:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }
    stage('Build Client Docker Image') {
      steps {
        dir('client') {
          sh 'docker build -t $DOCKER_IMAGE_CLIENT .'
        }
      }
    }
    stage('Build Server Docker Image') {
      steps {
        dir('server') {
          sh 'docker build -t $DOCKER_IMAGE_SERVER .'
        }
      }
    }
    stage('Run SonarQube Scan') {
      steps {
        withSonarQubeEnv('SonarQubeServer') {
          sh 'sonar-scanner'
        }
      }
    }
    stage('Push Docker Images') {
      steps {
        sh 'docker push $DOCKER_IMAGE_CLIENT'
        sh 'docker push $DOCKER_IMAGE_SERVER'
      }
    }
  }
}
