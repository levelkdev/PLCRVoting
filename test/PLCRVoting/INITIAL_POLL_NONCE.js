/* eslint-env mocha */
/* global contract assert artifacts */

const deployTestToken = require('../helpers/deployTestToken');

const PLCRVoting = artifacts.require('./PLCRVoting.sol');
const PLCRFactory = artifacts.require('./PLCRFactory.sol');

contract('PLCRVoting', (accounts) => {
  describe('Function: INITIAL_POLL_NONCE', () => {
    let plcr;

    before(async () => {
      const plcrFactory = await PLCRFactory.deployed();
      const token = await deployTestToken(accounts[0]);
      const receipt = await plcrFactory.newPLCRBYOToken(token.address);
      plcr = PLCRVoting.at(receipt.logs[0].args.plcr);
    });

    it('should be zero', async () => {
      assert.strictEqual((await plcr.INITIAL_POLL_NONCE.call()).toString(10), '0',
        'The INITIAL_POLL_NONCE was not initialized to zero');
    });
  });
});

