# Contributing

We love pull requests from everyone. By participating in this project, you
agree to abide by the [code of conduct](https://github.com/prdog/prdog/blob/master/CODE_OF_CONDUCT.md).

## Contribution Guide

* Make sure there are no other open issues or PRs
* Fork, then clone the repo
* Setup your machine
  * Install docker and docker-compose
  * Run `docker-compose build` to build the app
  * Run `docker-compose -e PORT=3000 -e USERS=./config/users.yml -e SLACK_API_TOKEN=slack-api-token \
        -e SLACK_VERIFICATION_TOKEN=verification-token -e GITHUB_SECRET=gh_secret \
        -e GITHUB_API_TOKEN=gh_token run --rm --service-ports prdog bash` for a terminal inside the container.
  - `nodemon app.js`
  * Make sure existing tests pass: `npm test`
* Make your changes and add test cases
* Run new tests again: `npm test`
* Run and test the program: `nodemon app.js`
* Push to your fork and [submit a pull request](https://github.com/prdog/prdog/compare)
* Make sure tests pass in the CI
* Make sure you sign the [Contributor License Agreement](https://cla-assistant.io/prdog/prdog)
