## Bootstrap development
- `git clone https://github.com/PRDog/prdog.git`
- `cd prdog`
- `npm install`
- `sudo npm install -g nodemon`
- Run it with `nodemon app.js`
- create config files
  - config/development.yaml
    ```
    port: 3000
    slack:
      apiToken: xoxp-2322910965-92696743540-284006249974-f5ad2c4a08ca95a01749538a84aadffb
      reqValidationToken: p1fW21yQORzQUwkL6lE2vu1g
    github:
      secret: [replace this with any scret code]
    ```
  - config/users.yaml
      ```
      - slack_user: lorenzo.fundaro
        git_user: lfundaro
      - slack_user: tbillet
        git_user: tbillet
      ```  
  - Replace `github.secret` with your own secret code
- Install and start ngrok
  - Follow instructions here to install: https://ngrok.com/download
  - Run it with `ngrok http localhost:3000`
- Add a new webhook in github's test repo
  - Go to https://github.com/PRDog/testRepo/settings/hooks/new
  - In Payload URL, copy the http URL displayed in ngrok and append `/pull_request` at the end
    - ex: `http://af6c5b45.ngrok.io/pull_request`
  - Select Content type `application/json`
  - Paste your github secret in the secret field
  - Select "Send me everything"
