## Bootstrap development
- `git clone https://github.com/PRDog/prdog.git`
- `cd prdog`
- create config files
  - config/development.yaml
    ```
    port: 3000
    users: './config/users.yml'
    slack:
      apiToken: [slack token here]
      reqValidationToken: [validation token here]
    github:
      secret: [replace this with any secret code]
      apiToken: [replace with a valid github token]  # Comment the full line for public repositories
    ```
  - config/users.yaml
      ```
      - slack_user: lorenzo.fundaro
        git_user: lfundaro
      - slack_user: tbillet
        git_user: tbillet
      ```
  - Replace `github.secret` with your own secret code
  - Replace `github.apiToken` with a valid github API token
- `docker-compose build`
- `docker-compose run --rm --service-ports prdog bash`
- `nodemon app.js`
- Install and start ngrok
  - Follow instructions here to install: https://ngrok.com/download
  - Run it with `ngrok http localhost:3000` **twice**
- Add 2 new webhooks in github's test repo
  - Go to https://github.com/PRDog/testRepo/settings/hooks/new
  - In Payload URL, copy the http URL displayed in ngrok and append `/pull_request` at the end
    - ex: `http://af6c5b45.ngrok.io/pull_request`
  - Select Content type `application/json`
  - Paste your github secret in the secret field
  - Select "Send me everything"
  - in the second Webhook: In Payload URL, copy the http URL displayed in ngrok and append `/pr_statuses` at the end select _Status_ only

## Simple test flow
- Login on github with another account than your personal one
- Create a PR on the [testRepo](https://github.com/PRDog/testRepo) with that other account
- Assign your personal account as reviewer for that Pull Request
- you should receive a notification on your slack account
