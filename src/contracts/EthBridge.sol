// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./Bridge.sol";

contract EthBridge is Bridge {
    constructor(address _token) Bridge(_token) {}
}
