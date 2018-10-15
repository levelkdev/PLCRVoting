pragma solidity ^0.4.24;

import 'openzeppelin-zos/contracts/token/ERC20/DetailedERC20.sol';
import 'openzeppelin-zos/contracts/token/ERC20/MintableToken.sol';

contract ERC20Token is DetailedERC20, StandardToken {
  constructor (uint _initialAmount, string _name, uint8 _decimals, string _symbol)
    public
  {
    super.initialize(_name, _symbol, _decimals);
    balances[msg.sender] = _initialAmount;
  }
}
