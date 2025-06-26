pipeline {
  agent any

  environment {
    DISCORD_WEBHOOK_GIT    = credentials('discord-webhook-git')
    DISCORD_WEBHOOK_TEST   = credentials('discord-webhook-test')
    DISCORD_WEBHOOK_SONAR  = credentials('discord-webhook-sonar')
  }

  stages {
    stage('Notifier Discord') {
      steps {
        script {
          def author  = sh(script: "git log -1 --pretty=format:%an", returnStdout: true).trim()
          def message = sh(script: "git log -1 --pretty=format:%s", returnStdout: true).trim()

          sh """
            curl -H "Content-Type:application/json" -X POST -d '{
              "content": "📢 Nouveau **push** détecté sur la branche `origin/dev` ! 🚀\\n👤 **Auteur** : ${author}\\n📝 **Commit** : ${message}"
            }' "${DISCORD_WEBHOOK_GIT}"
          """
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
              // Marquer le build comme unstable en cas d'erreur dans les tests Cypress
              currentBuild.result = 'UNSTABLE'
              throw e
            }
          }
        }
      }
      post {
        // Publier les rapports de tests, toujours
        always {
          junit 'frontend/cypress/results/*.xml'
        }
        // En cas de build instable (tests échoués partiellement)
        unstable {
          echo '⚠️ Build unstable en raison des tests Cypress'
          sh """
            curl -H "Content-Type:application/json" -X POST -d '{
              "content": "⚠️ **Build UNSTABLE**: Certains tests Cypress ont échoué. Voir les résultats dans Jenkins pour plus d’informations."
            }' "${DISCORD_WEBHOOK_TEST}"
          """
        }
        // En cas d’échec total des tests
        failure {
          sh """
            curl -H "Content-Type:application/json" -X POST -d '{
              "content": "❌ **Tests Cypress échoués !**\\nVoir les résultats dans Jenkins pour plus d’informations."
            }' "${DISCORD_WEBHOOK_TEST}"
          """
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
        sh """
          curl -H "Content-Type:application/json" -X POST -d '{
            "content": "📊 Analyse **SonarQube** terminée avec succès. 🔍"
          }' "${DISCORD_WEBHOOK_SONAR}"
        """
      }
    }
  }
}
