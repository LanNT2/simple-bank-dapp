// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;
import "./ERC20Token.sol";

contract RKToken is ERC20Token {
    constructor () public ERC20Token("RK Token", "RKToken") {
    }
}