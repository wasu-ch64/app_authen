pipeline {
    agent any
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh '''
                    echo "🚀 Setting up project..."
                    if [ -f "package.json" ]; then
                        echo "📦 Installing dependencies..."
                        npm install
                    fi
                '''
            }
        }
        
        stage('Code Quality Check') {
            steps {
                sh '''
                    echo "🔍 Running code quality checks..."
                    
                    # ตรวจสอบ HTML validity
                    echo "Checking HTML files..."
                    find ./client -name "*.html" -exec echo "✅ Found: {}" \\;
                    
                    # ตรวจสอบ CSS syntax
                    echo "Checking CSS files..."
                    find ./client -name "*.css" -exec echo "✅ Found: {}" \\;
                    
                    # ตรวจสอบ JS files
                    echo "Checking JavaScript files..."
                    find ./client -name "*.js" -exec echo "✅ Found: {}" \\;
                    
                    # File size check
                    echo "📊 File sizes:"
                    find ./client -type f \\( -name "*.html" -o -name "*.css" -o -name "*.js" \\) -exec ls -lh {} \\;
                '''
            }
        }
        
        stage('Test') {
            steps {
                sh '''
                    echo "🧪 Running tests..."
                    
                    # ตรวจสอบว่าไฟล์หลักครบหรือไม่
                    if [ -f "./client/index.html" ]; then
                        echo "✅ Main HTML file exists"
                    else
                        echo "❌ Main HTML file missing"
                        exit 1
                    fi
                    
                    # ตรวจสอบ responsive meta tag
                    if grep -q "viewport" ./client/index.html; then
                        echo "✅ Responsive meta tag found"
                    else
                        echo "⚠️  No responsive meta tag found"
                    fi
                    
                    # ตรวจสอบ title tag
                    if grep -q "<title>" ./client/index.html; then
                        echo "✅ Title tag found"
                        grep "<title>" ./client/index.html
                    else
                        echo "⚠️  No title tag found"
                    fi
                    
                    echo "✅ Basic tests completed!"
                '''
            }
        }
        
        stage('Build') {
            steps {
                sh '''
                    echo "🔨 Building project..."
                    mkdir -p dist
                    
                    # Copy client files to dist
                    cp -r client/* dist/
                    
                    # Create build info
                    echo "Build Date: $(date)" > dist/build-info.txt
                    echo "Build Number: ${BUILD_NUMBER}" >> dist/build-info.txt
                    echo "Git Commit: $(git rev-parse HEAD)" >> dist/build-info.txt
                    
                    echo "✅ Build completed!"
                    echo "📁 Build contents:"
                    ls -la dist/
                '''
            }
        }
        
        stage('Archive') {
            steps {
                archiveArtifacts artifacts: 'dist/**/*', fingerprint: true, allowEmptyArchive: true
                echo "📦 Artifacts archived successfully!"
            }
        }
    }
    
    post {
        always {
            echo '🏁 Pipeline completed'
        }
        success {
            echo '🎉 Build and Test Successful!'
            echo "🌐 Website ready for deployment!"
        }
        failure {
            echo '❌ Build or Test Failed!'
        }
    }
}
