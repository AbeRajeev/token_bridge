// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Token.sol";

contract EthToken is Token {
    constructor(string memory _name, string memory _symbol)
        Token(_name, _symbol)
    {}
}
