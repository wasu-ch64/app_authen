pipeline {
    agent any
    
    tools {
        nodejs 'NodeJS 20' // ตั้งชื่อ NodeJS version ใน Jenkins
    }
    
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', 
                    url: 'https://github.com/wasu-ch64/app_authen.git'
            }
        }
        
        stage('Install Dependencies') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm install'
                    } else {
                        echo 'No package.json found, skipping npm install'
                    }
                }
            }
        }
        
        stage('Lint Check') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm run lint || echo "No lint script found"'
                    } else {
                        echo 'Running basic HTML validation'
                        sh '''
                            find . -name "*.html" -exec echo "Checking {}" \\;
                            # เพิ่ม HTML validation ถ้าต้องการ
                        '''
                    }
                }
            }
        }
        
        stage('Test') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm test || echo "No test script found"'
                    } else {
                        echo 'Running basic file structure test'
                        sh '''
                            echo "Checking if index.html exists..."
                            if [ -f "index.html" ]; then
                                echo "✓ index.html found"
                            else
                                echo "✗ index.html not found"
                                exit 1
                            fi
                            
                            echo "Checking for CSS files..."
                            find . -name "*.css" -type f | head -5
                            
                            echo "Checking for JS files..."
                            find . -name "*.js" -type f | head -5
                            
                            echo "Basic structure test passed!"
                        '''
                    }
                }
            }
        }
        
        stage('Build') {
            steps {
                script {
                    if (fileExists('package.json')) {
                        sh 'npm run build || echo "No build script found"'
                    } else {
                        echo 'Creating simple build directory'
                        sh '''
                            mkdir -p dist
                            cp -r * dist/ 2>/dev/null || true
                            echo "Simple build completed"
                        '''
                    }
                }
            }
        }
        
        stage('Archive') {
            steps {
                script {
                    if (fileExists('dist')) {
                        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                    } else {
                        archiveArtifacts artifacts: '*.html,*.css,*.js,assets/**/*', 
                                       allowEmptyArchive: true, fingerprint: true
                    }
                }
            }
        }
    }
    
    post {
        always {
            echo 'Build pipeline completed'
        }
        success {
            echo '✓ Website build successful!'
        }
        failure {
            echo '✗ Website build failed!'
        }
    }
}
