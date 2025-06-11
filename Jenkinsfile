pipeline {
  agent any

  environment {
    DOCKER_REGISTRY = "wasu1304"
    IMAGE_CLIENT = "${DOCKER_REGISTRY}/app_authen_client:latest"
    IMAGE_SERVER = "${DOCKER_REGISTRY}/app_authen_server:latest"
  }

  stages {
    stage('Checkout') {
      steps {
        checkout scm
      }
    }

    stage('Test Server') {
      agent {
        docker {
          image 'node:18'
        }
      }
      steps {
        dir('server') {
          sh 'npm install'
          sh 'npm run test'
        }
      }
    }

    stage('Docker Login') {
      agent any
      steps {
        withCredentials([usernamePassword(credentialsId: 'docker-hub-credential-id', usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
          sh 'echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin'
        }
      }
    }

    stage('Build Client Docker Image') {
      agent any
      steps {
        dir('client') {
          sh "docker build -f Dockerfile.client -t ${IMAGE_CLIENT} ."
        }
      }
    }

    stage('Build Server Docker Image') {
      agent any
      steps {
        dir('server') {
          sh "docker build -f Dockerfile.server -t ${IMAGE_SERVER} ."
        }
      }
    }

    stage('Push Docker Images') {
      agent any
      steps {
        sh "docker push ${IMAGE_CLIENT}"
        sh "docker push ${IMAGE_SERVER}"
      }
    }
  }
}
