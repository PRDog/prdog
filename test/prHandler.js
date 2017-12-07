const assert = require('chai').assert
const expect = require('chai').expect
const sinon = require('sinon')
const { prHandlerUtils, notifier, pullRequestHandler } = require('../controllers/prHandler')

describe('prHandler', function() {
  let userMap, pr

  beforeEach(function() {
    userMap = new Map([['lfundaro', 'lorenzo'], ['tammymendt', 'tammy'], ['lfundarotest', 'test']])
    pr = require('./fixtures/pr')
  })

  describe('#canNotifyOnSlack', function() {
    it('returns true when there is a mapping', function() {
      const canNotify = prHandlerUtils.canNotifyOnSlack(userMap)('lfundaro')
      assert.isTrue(canNotify, 'we can notify lfundaro')
    })
    it('returns false when there is no mapping', function() {
      const canNotify = prHandlerUtils.canNotifyOnSlack(userMap)('xfundaro')
      assert.isFalse(canNotify, 'we cant notify xfundaro')
    })
  })

  describe('#unionRevAssig', function() {
    let unionUsers

    beforeEach(function() {
      unionUsers = prHandlerUtils.unionRevAssig(pr.pull_request)
    })

    it('returns a set', function() {
      expect(unionUsers).to.be.a('set')
    })
    it('returns a non empty set', function() {
      expect(unionUsers).to.not.be.empty
    })
    it('takes the union of reviewers and assignees', function() {
      expect(unionUsers).to.have.all.keys('lfundaro', 'tammymendt', 'lfundarotest', 'iuri')
    })
  })

  describe('#notifyOnNewEvent', function() {
    let slackApi, messageBuilder
    beforeEach(function() {
      slackApi = { chat: { postMessage: sinon.spy()}}
      messageBuilder = sinon.spy()
    })

    it('should call postMessage to people who can be notified on slack', function() {
      const pullReq = pr.pull_request
      notifier.notifyOnNewEvent(pullReq.requested_reviewers, userMap, slackApi, pr.pull_request, messageBuilder)
      sinon.assert.calledTwice(slackApi.chat.postMessage)
      sinon.assert.calledWith(slackApi.chat.postMessage, '@lorenzo')
      sinon.assert.calledWith(slackApi.chat.postMessage, '@tammy')
    })
  })

  describe('#notifyOnModEvent', function() {
    let slackApi, messageBuilder, pReq
    beforeEach(function() {
      slackApi = { chat: { postMessage: sinon.spy()}}
      messageBuilder = sinon.spy()
      pReq = pr.pull_request
    })

    it('should call postMessage to people who can be notified on slack', function() {
      notifier.notifyOnModEvent(pReq, userMap, slackApi, pr.sender.login, messageBuilder)
      sinon.assert.calledTwice(slackApi.chat.postMessage)
      sinon.assert.calledWith(slackApi.chat.postMessage, '@tammy')
      sinon.assert.calledWith(slackApi.chat.postMessage, '@lorenzo')
    })

    it('should not call postMessage with the sender as recipient', function() {
      notifier.notifyOnModEvent(pReq, userMap, slackApi, pr.sender.login, messageBuilder)
      sinon.assert.neverCalledWith(slackApi.chat.postMessage, '@lfundarotest')
    })
  })

  describe('#pullRequestHandler', function() {
    let slackApi, req, res, spyNotifier
    beforeEach(function() {
      slackApi = { chat: { postMessage: sinon.spy()}}
      res = { status: sinon.stub().withArgs(200).returns({ end: sinon.spy() }) }
      req = { body: pr }
      spyNotifier = { notifyOnModEvent: sinon.spy(), notifyOnNewEvent: sinon.spy() }
    })

    it('should call on review requested', function() {
      pr.action = 'review_requested'
      pullRequestHandler(userMap, slackApi, spyNotifier)(req, res)
      sinon.assert.calledOnce(spyNotifier.notifyOnNewEvent)
    })
  })
})
