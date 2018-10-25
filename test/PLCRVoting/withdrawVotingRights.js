/* eslint-env mocha */
/* global contract assert artifacts */

const deployTestToken = require('../helpers/deployTestToken');

const PLCRVoting = artifacts.require('./PLCRVoting.sol');
const PLCRFactory = artifacts.require('./PLCRFactory.sol');

const utils = require('./utils.js');

contract('PLCRVoting', (accounts) => {
  describe('Function: withdrawVotingRights', () => {
    const [alice] = accounts;
    let plcr;

    before(async () => {
      const plcrFactory = await PLCRFactory.deployed();
      const token = await deployTestToken(accounts[0]);
      const factoryReceipt = await plcrFactory.newPLCRBYOToken(token.address);
      plcr = PLCRVoting.at(factoryReceipt.logs[0].args.plcr);

      await Promise.all(
        accounts.map(async (user) => {
          await token.transfer(user, 100);
          await token.approve(plcr.address, 100, { from: user });
        }),
      );
    });

    it('should withdraw voting rights for 10 tokens', async () => {
      await utils.as(alice, plcr.requestVotingRights, 11);
      await utils.as(alice, plcr.withdrawVotingRights, 10);

      const finalBalance = await plcr.voteTokenBalance.call(alice);
      assert.strictEqual(finalBalance.toString(), '1',
        'Alice could not withdraw voting rights');
    });

    it('should fail when the user requests to withdraw more tokens than are available to them',
      async () => {
        const errMsg = 'Alice was able to withdraw more voting rights than she should have had';
        try {
          await utils.as(alice, plcr.withdrawVotingRights, 10);
          assert(false, errMsg);
        } catch (err) {
          assert(utils.isEVMException(err), err);
        }
        const voteTokenBalance = await plcr.voteTokenBalance.call(alice);
        assert.strictEqual(voteTokenBalance.toNumber(10), 1, errMsg);
      });

    it('should withdraw voting rights for all remaining tokens', async () => {
      await utils.as(alice, plcr.withdrawVotingRights, 1);
      const voteTokenBalance = await plcr.voteTokenBalance.call(alice);
      assert.strictEqual(voteTokenBalance.toNumber(10), 0,
        'Alice has voting rights when she should have none');
    });
  });
});

