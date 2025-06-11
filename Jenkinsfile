pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('List Files') {
            steps {
                sh 'ls -la'
                sh 'pwd'
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    echo "Testing website files..."
                    if [ -f "index.html" ]; then
                        echo "✅ index.html found"
                    else
                        echo "❌ index.html not found"
                    fi
                    
                    echo "All files in directory:"
                    find . -type f -name "*.html" -o -name "*.css" -o -name "*.js"
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    echo "Building website..."
                    mkdir -p build
                    cp -r * build/ 2>/dev/null || true
                    echo "✅ Build completed"
                '''
            }
        }
    }
    
    post {
        success {
            echo '🎉 Build Success!'
        }
        failure {
            echo '❌ Build Failed!'
        }
    }
}
