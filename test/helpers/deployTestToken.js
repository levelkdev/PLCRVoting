/* eslint-env mocha */
/* global artifacts */

const encodeCall = require('zos-lib/lib/helpers/encodeCall').default;

const StandaloneERC20 = artifacts.require('./StandaloneERC20.sol');

module.exports = async (account) => {
  const token = await StandaloneERC20.new();
  const callData = encodeCall(
    'initialize',
    ['string', 'string', 'uint8', 'uint256', 'address', 'address[]', 'address[]'],
    ['TestToken', 'TEST', '0', '10000', account, [], []],
  );
  await token.sendTransaction({ data: callData });
  return token;
};
