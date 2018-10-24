/* global artifacts */

const PLCRFactory = artifacts.require('./PLCRFactory.sol');

module.exports = (deployer) => {
  deployer.deploy(PLCRFactory);
};
