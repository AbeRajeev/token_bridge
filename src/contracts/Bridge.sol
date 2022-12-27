// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./Token.sol";

contract Bridge {
    Token public token;

    mapping(address => mapping(uint256 => bool)) public hasProcessed; // user => nonce => processed
    mapping(address => uint256) public transferCount; // number of transfers per user

    enum Type {
        Burn,
        Mint
    }

    event Transfer(
        address indexed from,
        address to,
        uint256 indexed amount,
        uint256 date,
        uint256 nonce,
        bytes signature,
        Type indexed step
    );

    constructor(address _token) {
        token = Token(_token);
    }

    /*     function burn(address _to, uint256 _amount, uint256 _nonce, bytes memory _signature) public {
        require(!hasProcessed[msg.sender][_nonce], "Transfer already processed");
        require(transferCount[msg.sender] == _nonce, "Invalid nonce");
        require(token.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        bytes32 message = prefixed(keccak256(abi.encodePacked(msg.sender, _to, _amount, _nonce)));
        require(recoverSigner(message, _signature) == token.bridge(), "Invalid signature");

        hasProcessed[msg.sender][_nonce] = true;
        transferCount[msg.sender]++;

        emit Transfer(msg.sender, _to, _amount, block.timestamp, _nonce, _signature, Type.Burn);
    } */

    function burn(
        address _to,
        uint256 _amoount,
        bytes calldata _signature
    ) external {
        transferCount[msg.sender] = transferCount[msg.sender] + 1;
        token.burn(msg.sender, _amoount);

        emit Transfer(
            msg.sender,
            _to,
            _amoount,
            block.timestamp,
            transferCount[msg.sender],
            _signature,
            Type.Burn
        );
    }

    function mint(
        address _from,
        address _to,
        uint256 _amount,
        uint256 _nonce,
        bytes calldata _signature
    ) external {
        bytes32 messageHash = keccak256(abi.encodePacked(_to, _amount, _nonce));
        bytes32 message = ECDSA.toEthSignedMessageHash(messageHash);
        address signer = ECDSA.recover(message, _signature);

        require(signer == _from, "Invalid signature");

        uint256 id = transferCount[_to];
        hasProcessed[_to][id] = true;

        token.mint(_to, _amount);

        emit Transfer(
            _from,
            _to,
            _amount,
            block.timestamp,
            _nonce,
            _signature,
            Type.Mint
        );
    }
}
