// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./ERC20Token.sol";

contract RKToken is ERC20Token{

    constructor () public ERC20Token("RK Token", "RKToken") {
    }

    function transfer(address recipient, uint256 amount) public override returns (bool) {
       return super.transfer(recipient,amount);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public override returns (bool) {
        return super.transferFrom(sender,recipient,amount);  
    }

    function approve(address spender, uint256 amount) public override returns (bool) {
        return super.approve(spender,amount);
    }

    function increaseAllowance(address spender, uint256 addedValue) public override returns (bool) {
        return super.increaseAllowance(spender,addedValue);
    }

    function decreaseAllowance(address spender, uint256 subtractedValue) public override returns (bool) {
        return super.decreaseAllowance(spender,subtractedValue);
    }

    function mint(address account, uint256 amount) public override {
      super.mint(account,amount);
    }

}