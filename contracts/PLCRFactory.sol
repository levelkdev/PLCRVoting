pragma solidity ^0.4.20;

import "./ERC20Token.sol";
import "./PLCRVoting.sol";
import "./ProxyFactory.sol";

contract PLCRFactory {

  event newPLCR(address creator, ERC20Token token, PLCRVoting plcr);

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
  @param _token an ERC20Token token to be consumed by the new PLCR contract
  */
  function newPLCRBYOToken(ERC20Token _token) public returns (PLCRVoting) {
    PLCRVoting plcr = PLCRVoting(proxyFactory.createProxy(canonizedPLCR, ""));
    plcr.initialize(_token);

    emit newPLCR(msg.sender, _token, plcr);

    return plcr;
  }

  /*
  @dev deploys and initializes a new PLCRVoting contract and an ERC20Token to be consumed by the PLCR's
  initializer.
  @param _supply the total number of tokens to mint in the ERC20Token contract
  @param _name the name of the new ERC20Token token
  @param _decimals the decimal precision to be used in rendering balances in the ERC20Token token
  @param _symbol the symbol of the new ERC20Token token
  */
  function newPLCRWithToken(
    uint _supply,
    string _name,
    uint8 _decimals,
    string _symbol
  ) public returns (PLCRVoting) {
    // Create a new token and give all the tokens to the PLCR creator
    ERC20Token token = new ERC20Token(_supply, _name, _decimals, _symbol);
    token.transfer(msg.sender, _supply);

    // Create and initialize a new PLCR contract
    PLCRVoting plcr = PLCRVoting(proxyFactory.createProxy(canonizedPLCR, ""));
    plcr.initialize(token);

    emit newPLCR(msg.sender, token, plcr);

    return plcr;
  }
}
