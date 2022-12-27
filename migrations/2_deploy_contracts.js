const ethers = require('ethers');

const EthToken = artifacts.require("./EthToken");
const PolToken = artifacts.require("./PolToken");

const EthBridge = artifacts.require("./EthBridge");
const PolBridge = artifacts.require("./PolBridge");

module.exports = async function (deployer, network, accounts) {

    const name = "RWSTR Token";
    const symbol = "RWSTR";
    const supply = ethers.utils.parseUnits('10000', 'ether'); // 10000 tokens 

    // Define deployment for different networks
    if (network === 'development') {
        let token, bridge;

        // Deploy EthToken
        await deployer.deploy(EthToken, name, symbol);
        token = await EthToken.deployed();
        // Mint tokens
        await token.mint(accounts[0], supply);
        // Deploy EthBridge
        await deployer.deploy(EthBridge, token.address);
        bridge = await EthBridge.deployed();
        // Set bridge address in token
        await token.setBridge(bridge.address);
        // Deploy PolToken
        await deployer.deploy(PolToken, name, symbol);
        token = await PolToken.deployed();
        // Deploy PolBridge
        await deployer.deploy(PolBridge, token.address);
        bridge = await PolBridge.deployed();
        // Set bridge address in token
        await token.setBridge(bridge.address);

    }


};
