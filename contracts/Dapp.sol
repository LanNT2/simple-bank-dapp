
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
    
    constructor (address _tokenAddress, uint256 _depositRatePerYear) public {
        depositRatePerYear = _depositRatePerYear;
        rkToken = RKToken(_tokenAddress);
    }

    function calculateProfit(uint256 amount, uint256 numberOfDays) internal returns (uint256){
        return amount + (amount*depositRatePerYear*numberOfDays)/(365*100);
    }
    
    function setCustomerAddress(address _customerAddress) public onlyOwner{
        customer = _customerAddress;
    }
    function getAddress() public view returns (address) {
        return address(this);
    }
    
    function deposit(address _customerAddress, uint256 _numberOfTokens,uint256 __numberOfDays) external whenNotPaused onlyOwner{
         //set customerAddress
        setCustomerAddress(_customerAddress);
        
        require(customer != address(0),'address of customer can not be null');
        require(address(this) != address(0),'address of admin can not be null');
        require(rkToken.balanceOf(customer) >= _numberOfTokens, "NumberOfTokens can not exceed customer balance");

        // set numberOfDays to deposit
        numberOfDays = __numberOfDays;
        deadline = block.timestamp+ (numberOfDays * 1 days);
        //customer approve for rkToken to send money
        rkToken.approve(rkToken.getAddress(), _numberOfTokens);

        dappTotalSupply +=_numberOfTokens;

        rkToken.approve(address(this), _numberOfTokens);
        rkToken.transferFrom(customer, address(this), _numberOfTokens);
    }
    
    function withDraw(uint256 withDrawAmount) external whenNotPaused onlyOwner{
        require(block.timestamp >= deadline ,'Customer can withdraw money if not reach the deadline') ;
        require(withDrawAmount>0, 'Enter non-zero value for withdrawal');
        uint256 profit = calculateProfit(withDrawAmount,numberOfDays);
        rkToken.transfer(customer,withDrawAmount);
        dappTotalSupply -= withDrawAmount;
    }

    function pause() public onlyOwner {
        super._pause();
    }
}