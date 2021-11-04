
// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./ERC20Template.sol";
import "./CustomOwner.sol";

contract ERC20Token is ERC20Template, CustomOwner{
    uint256 private _totalSupply;
    string private _name;
    string private _symbol;

    mapping(address => uint256) private balances;
    
    mapping(address => mapping(address => uint256)) private allowances;

    constructor (string memory name, string memory symbol) public {
        _name =name;
        _symbol =symbol;
    }

    function balanceOf(address account) public view  override returns (uint256) {
        return balances[account];
    }
    
    function name() public view override returns (string memory) {
        return _name;
    }
    
    function symbol() public view override returns (string memory) {
        return _symbol;
    }

    /**
     * @dev Returns the number of decimals used to get its user representation.
     * For example, if `decimals` equals `2`, a balance of `505` tokens should
     * be displayed to a user as `5.05` (`505 / 10 ** 2`).
     *
     * Tokens usually opt for a value of 18, imitating the relationship between
     * Ether and Wei. This is the value {ERC20} uses, unless this function is
     * overridden;
     *
     * NOTE: This information is only used for _display_ purposes: it in
     * no way affects any of the arithmetic of the contract, including
     * {IERC20-balanceOf} and {IERC20-transfer}.
     */
    function decimals() public pure override returns (uint8) {
        return 18;
    }

     function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }
    
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require (sender!=address(0), "sender can not be zero address");
        require (recipient != address(0), "recipient can not be zero address");
        require (balances[sender]>=amount, "transfer amount can exceeds the balance");
        balances[sender] = balances[sender]- amount;
        balances[recipient] = balances[recipient]+amount;
        emit Transfer(sender, recipient, amount);
    }
    
    function allowance(address owner, address spender) public view override returns (uint256) {
        return allowances[owner][spender];
    }
    
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        _transfer(sender,recipient,amount);
        uint256 allowance = allowances[sender][msg.sender];
        require(amount <= allowance,"transfer amount can not exceeds the allowance");
        _approve(sender,msg.sender,allowance - amount);
        return true;  
    }
    
    function approve(address spender, uint256 amount) public virtual override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }
    
    function _approve(address owner, address spender, uint256 amount) internal {
        require(owner != address(0), " Can not approve from the zero address");
        require(spender != address(0), "Can not approve to the zero address");
        allowances[owner][spender] = amount;
        emit Approval(owner, spender, amount);
    }
    
    function increaseAllowance(address spender, uint256 addedValue) public virtual returns (bool) {
        _approve(msg.sender, spender, allowances[msg.sender][spender] + addedValue);
        return true;
    }
    
    function decreaseAllowance(address spender, uint256 subtractedValue) public virtual returns (bool) {
        uint256 currentAllowance = allowances[msg.sender][spender];
        require(currentAllowance >= subtractedValue, "decreased allowance below zero");
        _approve(msg.sender, spender, currentAllowance - subtractedValue);
        return true;
    }

     function getAddress() public view returns (address) {
        return address(this);
    }

    function mint(address account, uint256 amount) public virtual {
        require(account != address(0), "ERC20: mint to the zero address");
        _totalSupply += amount;
        balances[account] += amount;
        emit Transfer(address(0), account, amount);
    }

}