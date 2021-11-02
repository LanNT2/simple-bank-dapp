// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract CustomOwner {
   address owner;
   constructor() public {
      owner = msg.sender;
   }
   modifier onlyOwner {
      require(msg.sender == owner,"Caller is not owner");
      _;
   }
}