#!/usr/bin/env groovy

@Library("sec_ci_libs@v2-latest") _

// these dcos-ui branches are used as a whitelist by the security library
// if a build is triggered from these branches, it is considered safe
def master_branches = ["master", "jgieseke/dcos-22183-add-git-url-reporting"] as String[]

// these dcos channels are used as a whitelist to create releases "against"
// this pipeline can be triggered from different jobs providing other
// channels to run system tests against, if so, we do not want to create
// releases
def release_channels = ["testing/master"] as String[]

pipeline {
  agent {
    dockerfile {
      args  "--shm-size=1g"
    }
  }

  parameters {
    string(name: 'DCOS_CHANNEL', defaultValue: 'testing/master', description: 'Which DC/OS channel (PR or branch) should the cluster be built with? Example: testing/pull/1234')
    string(name: 'REPORT_TO_GIT_URL', defaultValue: '', description: 'Additional git commit API URL to report to. Example: https://api.github.com/repos/dcos/dcos/statuses/d123459157e1c46993136c80517bad2a72335891')
  }

  environment {
    JENKINS_VERSION = "yes"
    NODE_PATH = "node_modules"
    INSTALLER_URL_BASE="https://downloads.dcos.io/dcos"
    INSTALLER_URL_FILENAME="dcos_generate_config.sh"
  }

  options {
    timeout(time: 2, unit: "HOURS")
    disableConcurrentBuilds()
  }

  stages {
    stage("Authorization") {
      steps {
        user_is_authorized(master_branches, "8b793652-f26a-422f-a9ba-0d1e47eb9d89", "#frontend-dev")
      }
    }

    stage("Build") {
      steps {
        withCredentials([usernamePassword(credentialsId:'a7ac7f84-64ea-4483-8e66-bb204484e58f', passwordVariable:'GIT_PASSWORD', usernameVariable: 'GIT_USER')]) {
          sh "[ -n \"${params.REPORT_TO_GIT_URL}\" ] && python3 ./scripts/ci/github_status.py \"$JOB_NAME/${params.DCOS_CHANNEL}\" \"$BUILD_URL\" \"${params.REPORT_TO_GIT_URL}\" \"PENDING\""
        }

        sh "npm --unsafe-perm install"
        sh "npm run build"
        sh "tar czf release.tar.gz dist"
      }
    }

    stage("Test") {
      parallel {
        stage("Integration Test") {
          steps {
            sh "npm run integration-tests"
          }

          post {
            always {
              archiveArtifacts "cypress/**/*"
              junit "cypress/results.xml"
            }
          }
        }
        stage("System Test") {
          steps {
            withCredentials([
                [
                  $class: "AmazonWebServicesCredentialsBinding",
                  credentialsId: "f40eebe0-f9aa-4336-b460-b2c4d7876fde",
                  accessKeyVariable: "AWS_ACCESS_KEY_ID",
                  secretKeyVariable: "AWS_SECRET_ACCESS_KEY"
                ]
              ]) {
              sh "INSTALLER_URL='${env.INSTALLER_URL_BASE}/${params.DCOS_CHANNEL}/${env.INSTALLER_URL_FILENAME}' dcos-system-test-driver -j1 -v ./system-tests/driver-config/jenkins.sh"
            }
          }

          post {
            always {
              archiveArtifacts "results/**/*"
              junit "results/results.xml"
            }
          }
        }
      }
    }

    // Upload the current master as "latest" to s3
    // and update the corresponding DC/OS branch:
    // For Example:
    // - dcos-ui/master/dcos-ui-latest
    // - dcos-ui/1.12/dcos-ui-latest
    stage("Release Latest") {
      when {
        allOf {
          expression { master_branches.contains(BRANCH_NAME) }
          expression { release_channels.contains(params.DCOS_CHANNEL) }
        }
      }

      steps {
        withCredentials([
            string(credentialsId: "3f0dbb48-de33-431f-b91c-2366d2f0e1cf",variable: "AWS_ACCESS_KEY_ID"),
            string(credentialsId: "f585ec9a-3c38-4f67-8bdb-79e5d4761937",variable: "AWS_SECRET_ACCESS_KEY"),
            usernamePassword(credentialsId: "a7ac7f84-64ea-4483-8e66-bb204484e58f", passwordVariable: "GIT_PASSWORD", usernameVariable: "GIT_USER")
        ]) {
          sh "git config --global user.email $GIT_USER@users.noreply.github.com"
          sh "git config --global user.name 'MesosphereCI Robot'"
          sh "git config credential.helper 'cache --timeout=300'"

          sh "FORCE_UPLOAD=1 ./scripts/ci/release-latest"
        }
      }

      post {
        always {
          archiveArtifacts "buildinfo.json"
        }
      }
    }

    stage("Run Enterprise Pipeline") {
      when {
        expression {
          master_branches.contains(BRANCH_NAME)
        }
      }
      steps {
        build job: "frontend/dcos-ui-ee-pipeline/" + env.BRANCH_NAME.replaceAll("/", "%2F"), wait: false
      }
    }
  }

  post {
    always {
      withCredentials([usernamePassword(credentialsId:'a7ac7f84-64ea-4483-8e66-bb204484e58f', passwordVariable:'GIT_PASSWORD', usernameVariable: 'GIT_USER')]) {
          sh "[ -n \"${params.REPORT_TO_GIT_URL}\" ] && python3 ./scripts/ci/github_status.py \"$JOB_NAME/${params.DCOS_CHANNEL}\" \"$BUILD_URL\" \"${params.REPORT_TO_GIT_URL}\" \"$currentBuild.result\""
      }
    }
    failure {
      withCredentials([
        string(credentialsId: "8b793652-f26a-422f-a9ba-0d1e47eb9d89", variable: "SLACK_TOKEN")
      ]) {
        slackSend (
          channel: "#frontend-ci-status",
          color: "danger",
          message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.RUN_DISPLAY_URL})",
          teamDomain: "mesosphere",
          token: "${env.SLACK_TOKEN}",
        )
      }
    }
    unstable {
      withCredentials([
        string(credentialsId: "8b793652-f26a-422f-a9ba-0d1e47eb9d89", variable: "SLACK_TOKEN")
      ]) {
        slackSend (
          channel: "#frontend-ci-status",
          color: "warning",
          message: "UNSTABLE: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' (${env.RUN_DISPLAY_URL})",
          teamDomain: "mesosphere",
          token: "${env.SLACK_TOKEN}",
        )
      }
    }
  }
}
