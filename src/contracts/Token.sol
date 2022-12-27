// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token is Ownable, ERC20 {
    address public bridge;

    constructor(string memory name, string memory symbol) ERC20(name, symbol) {
        bridge = msg.sender;
    }

    function mint(address _to, uint256 _amount) public {
        require(msg.sender == bridge, "Only bridge can mint");
        _mint(_to, _amount);
    }

    function burn(address _owner, uint256 _amount) public {
        require(msg.sender == bridge, "Only bridge can burn");
        _burn(_owner, _amount);
    }

    function setBridge(address _bridge) public onlyOwner {
        bridge = _bridge;
    }
}
