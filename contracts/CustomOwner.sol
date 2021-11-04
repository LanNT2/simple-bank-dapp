// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract CustomOwner {
   address public owner;
   
   event OwnershipRenounced(address indexed previousOwner);
   event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

   constructor() public {
      owner = msg.sender;
   }
   modifier onlyOwner {
      require(msg.sender == owner,"Caller is not owner");
      _;
   }
    /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
   function transferOwnership(address newOwner) public onlyOwner {
      require(newOwner != address(0));
      emit OwnershipTransferred(owner, newOwner);
      owner = newOwner;
   }

   /**
      * @dev Allows the current owner to relinquish control of the contract.
      */
   function renounceOwnership() public onlyOwner {
      emit OwnershipRenounced(owner);
      owner = address(0);
   }
}