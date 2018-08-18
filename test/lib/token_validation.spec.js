var { tokenRequestValidation } = require('../../src/lib/token_validation');
const sinon = require('sinon');
const mockery = require('mockery');

describe('token validation', () => {
  before(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });
  });
  after(() => {
    mockery.disable();
  });
  afterEach(() => {
    mockery.deregisterAll();
    mockery.resetCache();
  });
  it('should not do token validation for /health endpoint', () => {
    const req = { url: '/health' };
    const resSpy = sinon.spy();
    const res = { status: resSpy };
    const next = sinon.spy();
    tokenRequestValidation(req, res, next);
    sinon.assert.notCalled(res.status);
    sinon.assert.calledOnce(next);
  });
  it('should not return 401 if Github token is valid', () => {
    const req = {
      get: key => {
        if (key === 'User-Agent') {
          return 'GitHub-Hookshot';
        } else {
          return 'sha1=abc';
        }
      },
      body: { foo: 'bar' },
      url: 'abc'
    };
    mockery.registerMock('crypto', {
      createHmac: () => {
        return {
          update: () => {
            return {
              digest: () => {
                return 'abc';
              }
            };
          }
        };
      }
    });
    tokenRequestValidation = require('../../src/lib/token_validation').tokenRequestValidation;
    const next = sinon.spy();
    const res = sinon.spy();
    tokenRequestValidation(req, res, next);
    sinon.assert.notCalled(res);
    sinon.assert.calledOnce(next);
  });
  it('should not return 401 if Slack token is valid', () => {
    const req = {
      get: key => {
        if (key === 'User-Agent') {
          return 'Slackbot';
        }
      },
      body: { payload: '{"token": "qux"}' },
      url: 'abc'
    };
    process.env.SLACK_VERIFICATION_TOKEN = 'qux';
    tokenRequestValidation = require('../../src/lib/token_validation').tokenRequestValidation;
    const next = sinon.spy();
    const res = sinon.spy();
    tokenRequestValidation(req, res, next);
    sinon.assert.notCalled(res);
    sinon.assert.calledOnce(next);
  });
  it('should return 401 if request is not coming from Slack or Github', () => {
    const req = {
      get: key => {
        if (key === 'User-Agent') {
          return 'Foo';
        }
      },
      url: '/abc'
    };
    const next = sinon.spy();
    const resSpy = sinon.spy();
    const res = {
      status: () => {
        return { end: () => resSpy() };
      }
    };
    tokenRequestValidation(req, res, next);
    sinon.assert.called(resSpy);
    sinon.assert.called(next);
  });
  it('should return 401 if Slack token is invalid', () => {
    const req = {
      get: key => {
        if (key === 'User-Agent') {
          return 'Slackbot';
        }
      },
      body: { payload: '{"token": "invalid"}' },
      url: 'abc'
    };
    process.env.SLACK_VERIFICATION_TOKEN = 'qux';
    tokenRequestValidation = require('../../src/lib/token_validation').tokenRequestValidation;
    const next = sinon.spy();
    const resSpy = sinon.spy();
    const res = {
      status: () => {
        return { end: () => resSpy() };
      }
    };
    tokenRequestValidation(req, res, next);
    sinon.assert.called(resSpy);
    sinon.assert.calledOnce(next);
  });
  it('should return 401 if Github token is invalid', () => {
    const req = {
      get: key => {
        if (key === 'User-Agent') {
          return 'GitHub-Hookshot';
        } else {
          return 'sha1=abcd';
        }
      },
      body: { foo: 'bar' },
      url: 'abc'
    };
    mockery.registerMock('crypto', {
      createHmac: () => {
        return {
          update: () => {
            return {
              digest: () => {
                return 'abc';
              }
            };
          }
        };
      }
    });
    tokenRequestValidation = require('../../src/lib/token_validation').tokenRequestValidation;
    const next = sinon.spy();
    const resSpy = sinon.spy();
    const res = {
      status: () => {
        return { end: () => resSpy() };
      }
    };
    tokenRequestValidation(req, res, next);
    sinon.assert.called(resSpy);
    sinon.assert.calledOnce(next);
  });
});
