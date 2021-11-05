
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./RKToken.sol";
import "./CustomOwner.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Dapp is CustomOwner,Pausable{
    RKToken private rkToken;
    uint256 public depositRatePerYear;
    address customer;
    uint256 public numberOfDays;
    // deadline that customer can withdraw token with profit
    uint256 public deadline;
    
    uint256 public dappTotalSupply;
    
    event ReceiveTokens(address _sender, uint256 amount);
    
    constructor (uint256 _depositRatePerYear) public {
        depositRatePerYear = _depositRatePerYear;
        deadline = block.timestamp+ (numberOfDays * 1 days);
    }
    function setNumberOfDays (uint256 __numberOfDays) public {
        numberOfDays = __numberOfDays;
    }

    function calculateProfit(uint256 amount, uint256 numberOfDays) internal returns (uint256){
        return amount + (amount*depositRatePerYear*numberOfDays)/(365*100);
    }
    
    function setRKToken(address _tokenAddress) public onlyOwner{
        rkToken = RKToken(_tokenAddress);
    }
    
    function setCustomerAddress(address _customerAddress) public onlyOwner{
        customer = _customerAddress;
    }
    function getAddress() public view returns (address) {
        return address(this);
    }
    
    function deposit(uint256 _numberOfTokens) external whenNotPaused onlyOwner{
        require(customer != address(0),'address of customer can not be null');
        require(address(this) != address(0),'address of admin can not be null');
        require(rkToken.balanceOf(customer) >= _numberOfTokens, "NumberOfTokens can not exceed customer balance");
        dappTotalSupply +=_numberOfTokens;
        rkToken.approve(address(this), _numberOfTokens);
        rkToken.transferFrom(customer, address(this), _numberOfTokens);
    }
    
    function withDraw(uint256 withDrawAmount) external whenNotPaused onlyOwner{
       require(block.timestamp >= deadline ,'Customer can withdraw money if not reach the deadline') ;
        uint256 profit = calculateProfit(withDrawAmount,numberOfDays);
        rkToken.transfer(customer,profit);
        dappTotalSupply -= profit;
    }

    function pause() public onlyOwner {
        super._pause();
    }
}