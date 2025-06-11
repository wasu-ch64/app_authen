pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = "wasu1304"       
    IMAGE_CLIENT = "${DOCKER_REGISTRY}/app_authen_client:latest"
    IMAGE_SERVER = "${DOCKER_REGISTRY}/app_authen_server:latest"
  }

  tools {
    sonarQubeScanner 'sonar-scan'            // ชื่อที่ตั้งใน Global Tool Configuration
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('SonarQube Analysis') {
      steps {
        withSonarQubeEnv('SonarQubeServer') { // ชื่อ SonarQube Server ใน Jenkins
          sh 'sonar-scanner'
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
