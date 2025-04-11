pipeline {
    agent any
    environment {
        // Define any environment variables you might need.
        // For example, if you’re deploying to a server or using AWS credentials.
        DEPLOY_SERVER = 'your.deploy.server'
    }
    stages {
        stage('Checkout') {
            steps {
                // Check out the source code from GitHub
                url: 'https://github.com/tuanliar95/micro-fe.git', branch: 'main'
            }
        }
        stage('Build') {
            steps {
                // Run your build commands if necessary
                // Example: sh 'npm install && npm run build'
                // echo 'Building the project...'
                sh 'yarn && cd react-home/ && yarn && yarn build'
            }
        }
        stage('Deploy') {
            steps {
                // Deploy your source code or build output.
                // This could be a shell script, rsync command, or any deployment command.
                // For example, copying files to a remote server:
                sh '''
                  scp -r ./build user@$DEPLOY_SERVER:/path/to/deploy
                '''
            }
        }
    }
}