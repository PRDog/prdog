const mockery = require('mockery');
var userLoader = require('../../src/lib/user_loader');
const sinon = require('sinon');
const assert = require('chai').assert;

describe('loadUsers', async () => {
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
  it('should exit if input is not a yaml file', async () => {
    const fsMock = {
      readFileSync: () => {
        return `---
                    - slack_user: foo
            git_user: foo.bar
                `;
      }
    };
    mockery.registerMock('fs', fsMock);
    const processSpy = sinon.spy();
    const exitMock = exitCode => processSpy(exitCode);
    const _process_exit = process.exit;
    process.exit = exitMock;
    await userLoader.loadUsers();
    sinon.assert.calledWith(processSpy, 1);
    process.exit = _process_exit;
  });
  it('should map slack email to slack ID and slack display_name', async () => {
    const fsMock = {
      readFileSync: () => {
        return `---
                    - slack_email: foo@bar.com
                      git_user: foo.bar
                `;
      }
    };
    mockery.registerMock('fs', fsMock);
    const slackClientMock = {
      getSlackApiClient: () => {
        return {
          users: {
            lookupByEmail: () => {
              return { user: { id: 'ABC', display_name: 'foo.bar' } };
            }
          }
        };
      }
    };
    mockery.registerMock('./slack_client_factory', slackClientMock);
    userLoader = require('../../src/lib/user_loader');
    const users = await userLoader.loadUsers();
    assert.deepEqual(users, { 'foo.bar': { id: 'ABC', display_name: 'foo.bar' } });
  });
  it('should skip users not found on slack', async () => {
    const fsMock = {
      readFileSync: () => {
        return `---
                      - slack_email: foo@bar.com
                        git_user: foo.bar
                  `;
      }
    };
    mockery.registerMock('fs', fsMock);
    const slackClientMock = {
      getSlackApiClient: () => {
        return {
          users: {
            lookupByEmail: () => {
              throw Error('User not found on slack');
            }
          }
        };
      }
    };
    mockery.registerMock('./slack_client_factory', slackClientMock);
    userLoader = require('../../src/lib/user_loader');
    const users = await userLoader.loadUsers();
    assert.isEmpty(users);
  });
});
