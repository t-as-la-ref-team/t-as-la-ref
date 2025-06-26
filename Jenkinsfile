pipeline {
  agent any

  environment {
    DISCORD_WEBHOOK_GIT = credentials('discord-webhook-git')
    DISCORD_WEBHOOK_TEST = credentials('discord-webhook-test')
    DISCORD_WEBHOOK_SONAR = credentials('discord-webhook-sonar')
  }

  stages {
    stage('Notifier Discord') {
      steps {
        withCredentials([string(credentialsId: 'discord-webhook-git', variable: 'DISCORD_WEBHOOK_GIT')]) {
          script {
            def author = sh(script: "git log -1 --pretty=format:%an", returnStdout: true).trim()
            def message = sh(script: "git log -1 --pretty=format:%s", returnStdout: true).trim()

            sh """
              curl -H Content-Type:application/json -X POST -d '{
                "content": "📢 Nouveau **push** détecté sur la branche `origin/dev` ! 🚀\\n👤 **Auteur** : ${author}\\n📝 **Commit** : ${message}"
              }' ${DISCORD_WEBHOOK_GIT}
            """
          }
        }
      }
    }

    stage('Test E2E (Cypress)') {
      steps {
        dir('frontend') {
          sh 'npm ci'

          script {
            try {
              sh 'npm run test:e2e'
            } catch (e) {
              currentBuild.result = 'UNSTABLE'
              throw e // pour déclencher "failure"
            }
          }
        }
      }

      post {
        always {
          junit 'frontend/cypress/results/*.xml'
        }
        unsuccessful {
          withCredentials([string(credentialsId: 'discord-webhook-test', variable: 'DISCORD_WEBHOOK_TEST')]) {
            sh """
              curl -H Content-Type:application/json -X POST -d '{
                "content": "❌ **Tests Cypress échoués !**\\nVoir les résultats dans Jenkins pour plus d’infos."
              }' ${DISCORD_WEBHOOK_TEST}
            """
          }
        }
      }
    }

    stage('Analyse SonarQube') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        withSonarQubeEnv('sonarqube-server') {
          dir('frontend') {
            sh 'sonar-scanner'
          }
        }
      }
    }

    stage('Notification Analyse') {
      when {
        expression { currentBuild.result == null || currentBuild.result == 'SUCCESS' }
      }
      steps {
        withCredentials([string(credentialsId: 'discord-webhook-sonar', variable: 'DISCORD_WEBHOOK_SONAR')]) {
          sh """
            curl -H Content-Type:application/json -X POST -d '{
              "content": "📊 Analyse **SonarQube** terminée avec succès. 🔍"
            }' ${DISCORD_WEBHOOK_SONAR}
          """
        }
      }
    }
  }
}
