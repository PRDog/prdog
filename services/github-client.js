const config = require('config')
const request = require('request').defaults(initHeaders(config))

function initHeaders(config) {
    let defaultRequestConfig = {
        headers: {'User-Agent': 'pr-dog'}
    }
    if (config.github.apiToken) {
        defaultRequestConfig.headers['Authorization'] = `token ${config.github.apiToken}`
    }
    return defaultRequestConfig;
}

const getPRComments = (pullRequestUrl, callback) => {

    request(`${pullRequestUrl}/comments`, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            return callback(eval(body));
        } else {
            console.log('Call failed: ' + response.statusCode)
            return callback([])
        }
    })
}

module.exports = { getPRComments }
