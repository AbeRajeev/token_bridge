const PolToken = artifacts.require("PolToken");
const EthToken = artifacts.require("EthToken");

const EthBridge = artifacts.require("EthBridge");
const PolBridge = artifacts.require("PolBridge");

const { expect, assert } = require("chai");
require("chai").use(require("chai-as-promised")).should();
const { ethers } = require("ethers");

contract("Bridge", function (accounts) {
    let contract;
    let ethToken, polToken, ethBridge, polBridge;

    beforeEach(async function () {
        // Deploy a new instance of the Token contract
        ethToken = await EthToken.new("Test Eth Token", "TST");
        // Deploy a new instance of the Bridge contract
        ethBridge = await EthBridge.new(ethToken.address);

        await ethToken.mint(accounts[1], 1000);
        await ethToken.setBridge(ethBridge.address);

        polToken = await PolToken.new("Test Pol Token", "TPT");
        polBridge = await PolBridge.new(polToken.address);

        await polToken.mint(accounts[1], 1000);
        await polToken.setBridge(polBridge.address);

    });

    it("Correct deployment addresses", async function () {
        contract = await ethBridge.token();
        assert.equal(contract, ethToken.address, "Incorrect token address");

        contract = await polBridge.token();
        assert.equal(contract, polToken.address, "Incorrect token address");
    });

    /* it("should mint tokens correctly", async function () {
        // Test the mint function
        const result = await ethBridge.mint(accounts[1], accounts[2], 100, 1, "0x0");
        // Check that the balance of the account was updated correctly
        const balance = await ethToken.balanceOf(accounts[2]);
        expect(balance).to.equal(100);

    }); */

    describe('Burning correctly', () => {
        // Test the burn function
        beforeEach(async function () {
            contract = await ethBridge.burn(accounts[1], 100, [], { from: accounts[1] });
        });

        it("should burn tokens correctly", async function () {
            const balance = await ethToken.balanceOf(accounts[1]);
            assert.equal(balance.toString(), 900, "Incorrect balance after burning");
        });

        it("should emit a Transfer event on burn", async function () {
            // Check that the Transfer event was emitted correctly
            expect(contract.logs).to.have.lengthOf(1);
            const log = contract.logs[0];
            log.event.should.equal("Transfer");
            const event = log.args;

            event.from.should.equal(accounts[1]);
            event.amount.toString().should.equal('100');
            event.step.toString().should.equal('0');

        });

    });

    /*     describe('Minting correctly', () => {
    
            const messageHash = ethers.utils.solidityKeccak256(accounts[2], 100, 1);
            const privateKey = "0X0";
            const wallet = new ethers.Wallet(privateKey);
            const signature = wallet.signMessage(messageHash);
    
    
            // Test the mint function
            beforeEach(async function () {
                contract = await ethBridge.mint(accounts[1], accounts[2], 100, 1, signature, { from: accounts[1] });
            });
    
            it("should mint tokens correctly", async function () {
                // Check that the balance of the account was updated correctly
                const balance = await ethToken.balanceOf(accounts[2]);
                assert.equal(balance.toString(), 100, "Incorrect balance after minting");
            });
        }); */


});