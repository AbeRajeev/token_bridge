const ethers = require('ethers');

const EthToken = artifacts.require("./EthToken");
const PolToken = artifacts.require("./PolToken");

const EthBridge = artifacts.require("./EthBridge");
const PolBridge = artifacts.require("./PolBridge");

module.exports = async function (deployer, network, accounts) {

    const name = "RWSTR Token";
    const symbol = "RWSTR";
    const supply = ethers.utils.parseUnits('10000', 'ether'); // 10000 tokens 
    const Acc1 = "0x259bB0b6A47AC1cF83A92995f66BD3e7BcD35E5c";

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

    if (network === 'goerli') {
        await deployer.deploy(EthToken, name, symbol);
        const token = await EthToken.deployed();
        await token.mint(Acc1, supply);

        await deployer.deploy(EthBridge, token.address);
        const bridge = await EthBridge.deployed();

        await token.setBridge(bridge.address);
    }

    if (network === 'mumbai') {
        await deployer.deploy(PolToken, name, symbol);
        const token = await PolToken.deployed();

        await deployer.deploy(PolBridge, token.address);
        const bridge = await PolBridge.deployed();

        await token.setBridge(bridge.address);
    }



};
