pipeline {

  agent { label 'san-dev-mac-build-06' }

  options {
  	timestamps()
    disableConcurrentBuilds()
  }
  
  environment {
    DANGER_GITHUB_HOST='git.devops.quickplay.com'
    DANGER_GITHUB_API_BASE_URL='https://git.devops.quickplay.com/api/v3'
    DANGER_GITHUB_API_TOKEN=credentials('danger-bot-api-token')
    LANG="en_US.UTF-8"
    LANGUAGE="en_US.UTF-8"
    LC_ALL="en_US.UTF-8"
    LC_CTYPE="en_US.UTF-8"
  }

  stages {

    stage ("Skip Build?") {
      steps {
        
        // Skips the build, when commit log include [ci skip] message.
        script {
          result = sh (script: "git log -1 | grep '.*\\[ci skip\\].*'", returnStatus: true) 
          if (result == 0 && env.BRANCH_NAME != 'master') {
            echo ("'ci skip' spotted in git commit. Skipped CI, marking the build as success")
            env.shouldBuild = "false"
          }
        }
      }
    }

    stage('npm prepare') {
      when {
        expression {
          return env.shouldBuild != "false"
        }
      }

      steps {
        sh "npm install"

        // Install pod dependencies on iOS
        sh "npx pod-install ios" 
      }
    }

    stage('Run Tests & Lint') {
      when {
        expression {
          return env.shouldBuild != "false"
        }
      }

      parallel {
        stage('run tests') {
          steps {
            sh 'npm run test:coverage -- --ci'
          }
        }

        stage('run lint') {
          steps {
            sh "npm run lint:report"
          }
        }
      }
    }

    stage("Danger") {
      steps {
        // Run Danger
        sh 'npm run danger ci'
      }
    }

    stage("SonarQube Analysis") {
      when {
        expression {
          return env.shouldBuild != "false"
        }
      }

      steps {
        sh "npm run sonar"
      }
    }

  	// Run tests
    stage('Build') {
      when {
        expression {
          return env.shouldBuild != "false"
        }
      }

      parallel {
        // stage('Build Android') {
        //   steps {
        //       sh "BUILD_NAME=1.8 BUILD_NUMBER=${env.BUILD_NUMBER} ANDROID_KEYSTORE_FILE='dev_release.keystore' ANDROID_KEY_ALIAS='dev-alias' ANDROID_KEYSTORE_PASSWORD=RnA_*vE_B2b ANDROID_KEY_PASSWORD=RnA_*vE_B2b sh ./scripts/android/builder.sh"
        //   }
        // }

        stage('Build & Archive iOS, tvOS') {
          steps {
              sh "IOS_CERTIFICATE='TVPassDistribution.p12' IOS_CERTIFICATE_KEY='EWk9CN4coDFm' IOS_PROVISION_PROFILE='TVPassAdhocProfile.mobileprovision' sh scripts/ios/keychain.sh"
              sh "BUILD_NAME=1.0 PROJECT_NAME='TVPass' BUILD_NUMBER=${env.BUILD_NUMBER} IOS_SCHEME='TVPass' IOS_CONFIGURATION='Release' IOS_EXPORT_OPTIONS_PLIST='ExportOptions.plist' sh ./scripts/ios/builder.sh"

              // sh "IOS_CERTIFICATE='QuickplayOrganizationTVOSCertificate.p12' IOS_CERTIFICATE_KEY='quickplay1' IOS_PROVISION_PROFILE='tvOSB2BReactNativeShowcaseAppAdHocProfile.mobileprovision' sh ./scripts/tvos/keychain.sh"
              // sh "BUILD_NAME=1.0 PROJECT_NAME='B2BDemo' BUILD_NUMBER=${env.BUILD_NUMBER} IOS_SCHEME='B2BDemo-tvOS' IOS_CONFIGURATION='Release' IOS_EXPORT_OPTIONS_PLIST='ExportOptions.plist' sh ./scripts/tvos/builder.sh"
          }
        }
      }
    }

    // Run tests
    // stage('E2E Tests') {
    //   when {
    //     expression {
    //       return env.shouldBuild != "false"
    //     }
    //   }

    //   steps {
    //     sh "npm run start:appium && JEST_JUNIT_OUTPUT=./jest-e2e-test-results.xml IOS_APPLICATION_PATH=../../../ios/build/Products/IPA/B2BDemo.ipa IOS_PLATFORM_VERSION=12.1 TARGET_PLATFORM=ios npm run test:e2e -- --ci --reporters=default --reporters=jest-junit"
    //   }

    //   post {
    //     always {
    //       junit 'jest-e2e-test-results.xml'
    //     }
    //   }
    // }

    stage('Publish') {
      when {
        branch 'master'
      }

      environment {
        APPCENTER_IOS_API_TOKEN = credentials('rn-tvpass-ios-appcenter-token')
        // APPCENTER_ANDROID_API_TOKEN = credentials('react-native-android-appcenter-api-token')
      }

      parallel {
        // stage('Publish Android') {
        //   steps {

        //     appCenter apiToken: APPCENTER_ANDROID_API_TOKEN, 
        //     appName: 'nexgen-rn-android', 
        //     buildVersion: '', 
        //     distributionGroups: 'Collaborators', 
        //     notifyTesters: false, 
        //     ownerName: 'client-lib-sampleapp', 
        //     pathToApp: 'android/app/build/outputs/apk/release/app-release.apk', 
        //     pathToDebugSymbols: '', 
        //     pathToReleaseNotes: '', 
        //     releaseNotes: ''
        //   }
        // }

        stage('Publish iOS') {
          steps {

            appCenter apiToken: APPCENTER_IOS_API_TOKEN, 
            appName: 'TVPass', 
            buildVersion: '', 
            distributionGroups: '', 
            notifyTesters: false, 
            ownerName: 'TVPass', 
            pathToApp: 'ios/build/Products/IPA/TVPass.ipa', 
            pathToDebugSymbols: '', 
            pathToReleaseNotes: '', 
            releaseNotes: ''            
          }
        }

        // stage('Publish Docs') {
        //   steps {
        //     sshagent(['aaab7c58-4e97-4be1-a0a6-9624ca89d77f']) {
        //       sh "cd docs/website && yarn && USE_SSH=true GIT_USER=jenkins-x-bot yarn deploy"
        //     }
        //   }
        // }
      }
    }
  }

  post {
    always {
      script {
          currentBuild.result = currentBuild.result ?: 'SUCCESS'
      }
    }

    // failure {
      // TODO: currently recipientProviders isn't working as expected, although hard-coded email ids work. 
      // CI team is looking into this. We can add this back, when it's working.
       
      // def emailBody = "${currentBuild.currentResult}: Job ${env.JOB_NAME} build ${env.BUILD_NUMBER}\n More info at: ${env.BUILD_URL}"
      // def emailSubject = "Jenkins Build ${currentBuild.currentResult}: Job ${env.JOB_NAME}"
      // emailext body: emailBody, to: 'vasanth.vaidyanathan@intl.att.com', subject: emailSubject
      // recipientProviders: [culprits(), requestor(), brokenBuildSuspects(), developers()]
    // }

    cleanup {
        // sh 'npm run stop:appium'
        sh 'sh scripts/ios/removeKeychain.sh'
    }
  }
}
