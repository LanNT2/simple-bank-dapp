
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

interface ERC20Template {
    
    /*
    1. Is emited when when `value` tokens are moved from one account (`from`) to  another (`to`).`
    2. `value` may be zero.
    */
    event Transfer(address indexed from, address indexed to, uint256 value);
    
    /* Emitted when the allowance of a `spender` for an `owner` is set by a call to {approve}. `value` is the new allowance. */
    
    event Approval(address indexed owner, address indexed spender, uint256 value);
    
    
    function name() external view returns(string memory);
    
    function symbol() external view returns(string memory);

    
   /*  Return the amount of tokens in existence.*/
      
     function totalSupply() external view returns (uint256);
      
     /*Return the amount of tokens owned by 'account'*/
      
     function balanceOf(address account) external view returns (uint256);
    
    /*
        1. Moves `amount` tokens from the caller's account to `recipient`.
        2. Returns a boolean value indicating whether the operation succeeded.
        3. Emits a {Transfer} event.
    */
    function transfer(address recipient, uint256 amount) external returns (bool);
    
    /* 1. Moves `amount` tokens from `sender` to `recipient` using the allowance mechanism. `amount` is then subtracted from the caller's allowance 
       2.Returns a boolean value indicating whether the operation succeeded.
       3.Emits a {Transfer} event.
    */
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    
    /*1. Returns the remaining number of tokens that `spender` will be allowed to spend on behalf of `owner` through {transferFrom}.
      2. This is zero by default 
      3. This value changes when {approve} or {transferFrom} are called.
    */
    function allowance(address owner, address spender) external view returns (uint256);
    
    /* 1. Sets `amount` as the allowance of `spender` over the caller's tokens.
       2. Returns a boolean value indicating whether the operation succeeded.
       3. Emits an {Approval} event.
    */
    
     function approve(address spender, uint256 amount) external returns (bool);
    
    
}