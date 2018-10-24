pragma solidity ^0.4.20;

import "./PLCRVoting.sol";
import "./ProxyFactory.sol";

contract PLCRFactory {

  event newPLCR(address creator, address token, PLCRVoting plcr);

  ProxyFactory public proxyFactory;
  PLCRVoting public canonizedPLCR;

  /// @dev constructor deploys a new canonical PLCRVoting contract and a proxyFactory.
  constructor() public {
    canonizedPLCR = new PLCRVoting();
    proxyFactory = new ProxyFactory();
  }

  /*
  @dev deploys and initializes a new PLCRVoting contract that consumes a token at an address
  supplied by the user.
  @param _token StandaloneERC20 to be consumed by the new PLCR contract
  */
  function newPLCRBYOToken(address _token) public returns (PLCRVoting) {
    PLCRVoting plcr = PLCRVoting(proxyFactory.createProxy(canonizedPLCR, ""));
    plcr.initialize(_token);

    emit newPLCR(msg.sender, _token, plcr);

    return plcr;
  }

  // /*
  // @dev deploys and initializes a new PLCRVoting contract and a StandaloneERC20 to be consumed by the PLCR's
  // initializer.
  // @param _supply the total number of tokens to mint in the StandaloneERC20
  // @param _name the name of the new StandaloneERC20
  // @param _decimals the decimal precision to be used in rendering balances in the StandaloneERC20
  // @param _symbol the symbol of the new StandaloneERC20
  // */
  // function newPLCRWithToken(
  //   uint _supply,
  //   string _name,
  //   uint8 _decimals,
  //   string _symbol
  // ) public returns (PLCRVoting) {
  //   // Create a new token and give all the tokens to the PLCR creator
  //   // StandaloneERC20 token = new StandaloneERC20();
  //   // token.initialize(msg.sender);
  //   // token.mint(msg.sender, _supply);

  //   // // Create and initialize a new PLCR contract
  //   // PLCRVoting plcr = PLCRVoting(proxyFactory.createProxy(canonizedPLCR, ""));
  //   // plcr.initialize(token);

  //   // emit newPLCR(msg.sender, token, plcr);

  //   // return plcr;
  // }
}
