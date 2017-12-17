## What's PRDog ?

It's a tool to help you manage Github Pull Request workflow through Slack.

## Features:

- Personal notifications about PRs interactions: review assignment, request for changes,
approval, etc.

### Motivation

We wanted to create PRDog as a tool to help you manage Github's Pull Request (PR) from
your slack workspace. The idea is born behind a very simple need: automate delivery of
notifications when a PR interaction happens, for example: review assigned, comment, request for changes, approval, etc. But unlike any other Slack-Github integrations out there where
repository events go to a common channel, we want to make this communication delivered to you
personally and when it matters.

### Install on your Slack workspace

* Configure Slack:
    * Create a PRDog application within your Slack workspace.
    * Get an API Token and a Request Validation Token.
    * Set up interaction URL pointing to your PRDog running instance.
* Configure Github:
    * Create a Github Secret to use when configuring webhooks.
    * Create webhooks on every repo for which you want Github to send webhooks events to PRDog.
    * Get a Github API Token (with read-only permissions)
* Bootstrap PRDog application:
    * We provide a docker image with all you need to run PRDog.
    * Run PRDog somewhere in your infrastructure and expose it publicly so Github
      can send webhooks to it.

## Bootstrap development
- `git clone https://github.com/PRDog/prdog.git && cd prdog`
- create config files:
  - `config/users.yaml`
      ```
      - slack_user: lorenzo.fundaro
        git_user: lfundaro
      - slack_user: tbillet
        git_user: tbillet
      ```
  - Create a Slack workspace or use an existing one
    - [Create slack application](https://api.slack.com/apps) for testing.
    - Get a slack api token and Request Validation Token.
  - Create a Github Secret and get an API token (with read-only permissions).
- `docker-compose build`
- `docker-compose -e PORT=3000 -e USERS=./config/users.yml -e SLACK_API_TOKEN=slack-api-token \
      -e SLACK_VERIFICATION_TOKEN=verification-token -e GITHUB_SECRET=gh_secret \
      -e GITHUB_API_TOKEN=gh_token run --rm --service-ports prdog bash`
- `nodemon app.js`
- Install and start ngrok
  - Follow instructions here to install: https://ngrok.com/download
  - Run it with `ngrok http localhost:3000`
- Add 2 new webhooks in your Github's test repo
  - In Payload URL, copy the http URL displayed in ngrok and append `/pull_request` at the end
    - ex: `http://af6c5b45.ngrok.io/pull_request`
  - Select Content type `application/json`
  - Paste your github secret in the secret field
  - Select "Send me everything"
  - in the second Webhook: In Payload URL, copy the http URL displayed in ngrok and append `/pr_statuses` at the end select _Status_ only

## Simple test flow
- Login on github with another account than your personal one
- Create a PR on the on your test repo with that other account
- Assign your personal account as reviewer for that Pull Request
- you should receive a notification on your slack account
  - Run it with `ngrok http localhost:3000`
