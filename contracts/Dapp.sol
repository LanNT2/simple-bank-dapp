
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./ERC20Token.sol";

contract Dapp {
    ERC20Token private tokenContract;
    uint256 public depositRatePerYear;
    address customer;
    uint256 public numberOfDays;
    // deadline that customer can withdraw token with profit
    uint256 public deadline;
    
    uint256 public totalSupply;
    
    event ReceiveTokens(address _sender, uint256 amount);
    
    constructor (uint256 _depositRatePerYear, uint256 _numberOfDays) public {
        depositRatePerYear = _depositRatePerYear;
        numberOfDays = _numberOfDays;
        deadline = block.timestamp+ (_numberOfDays * 1 days);
    }
    function calculateProfit(uint256 amount, uint256 numberOfDays) internal returns (uint256){
        return amount + (amount*depositRatePerYear*numberOfDays)/(365*100);
    }
    
    function setTokenContract(address _tokenAddress) public{
        tokenContract = ERC20Token(_tokenAddress);
    }
    
    function setCustomerAddress(address _customerAddress) public {
        customer = _customerAddress;
    }
    function getAddress() public view returns (address) {
        return address(this);
    }
    
    function deposit(uint256 _numberOfTokens) external {
        require(customer != address(0),'address of customer can not be null');
        require(address(this) != address(0),'address of admin can not be null');
        require(tokenContract.balanceOf(customer) >= _numberOfTokens, "NumberOfTokens can not exceed customer balance");
        // tokenContract.transfer(address(this),_numberOfTokens);
        totalSupply +=_numberOfTokens;
        tokenContract.approve(address(this), _numberOfTokens);
        tokenContract.transferFrom(customer, address(this), _numberOfTokens);
    }
    
    function withDraw(uint256 withDrawAmount) external{
      // require(block.timestamp >= deadline ,'Customer can withdraw money if not reach the withDrawTimeLimit') ;
        uint256 profit = calculateProfit(withDrawAmount,numberOfDays);
        tokenContract.transfer(customer,profit);
        totalSupply -= profit;
    }
}