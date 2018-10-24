/* eslint-env mocha */
/* global contract assert artifacts */

const deployTestToken = require('../helpers/deployTestToken');

const PLCRVoting = artifacts.require('./PLCRVoting.sol');
const PLCRFactory = artifacts.require('./PLCRFactory.sol');

const utils = require('./utils.js');

contract('PLCRVoting', (accounts) => {
  describe('Function: didCommit', () => {
    const [alice] = accounts;
    let plcr;

    before(async () => {
      const plcrFactory = await PLCRFactory.deployed();
      const token = await deployTestToken(accounts[0]);
      const receipt = await plcrFactory.newPLCRBYOToken(token.address);

      plcr = PLCRVoting.at(receipt.logs[0].args.plcr);

      await Promise.all(
        accounts.map(async (user) => {
          await token.transfer(user, 1000);
          await token.approve(plcr.address, 1000, { from: user });
        }),
      );
    });

    it('should return true for a poll that a voter has committed', async () => {
      const options = utils.defaultOptions();
      options.actor = alice;

      // alice starts poll & commits
      const pollID = await utils.startPollAndCommitVote(options, plcr);

      // didCommit(alice, pollID)
      const actual = await plcr.didCommit.call(options.actor, pollID.toString());
      const expected = true;
      assert.strictEqual(actual, expected, 'should have returned true because alice DID commit');
    });

    it('should return false for a poll that a voter did not commit', async () => {
      const options = utils.defaultOptions();

      // start poll
      const receipt = await plcr.startPoll(options.quorum,
        options.commitPeriod, options.revealPeriod);
      const pollID = utils.getPollIDFromReceipt(receipt);

      // didCommit(alice, pollID)
      const actual = await plcr.didCommit.call(alice, pollID.toString());
      const expected = false;
      assert.strictEqual(actual, expected, 'should have returned false because alice did NOT commit');
    });

    it('should revert for a poll that doesnt exist', async () => {
      try {
        // didCommit(alice, 420420420)
        await plcr.didCommit.call(alice, '420420420');
      } catch (err) {
        assert(utils.isEVMException(err), err.toString());
        return;
      }
      assert(false, 'should not have been able to successfully call didCommit because the poll doesnt exists');
    });
  });
});
