const PolToken = artifacts.require("PolToken");
const EthToken = artifacts.require("EthToken");

contract("PolToken", function (accounts) {
    let contract;

    beforeEach(async function () {
        // Deploy a new instance of the PolToken contract before each test
        contract = await PolToken.new("Test Pol Token", "TPT");
    });

    it("should mint tokens correctly", async function () {
        // Test the mint function
        await contract.mint(accounts[1], 100);

        // Check that the balance of the account was updated correctly
        const balance = await contract.balanceOf(accounts[1]);
        assert.equal(balance, 100, "Incorrect balance after minting");
    });

    it("should burn tokens correctly", async function () {
        // First, mint some tokens to the contract
        await contract.mint(accounts[1], 100);

        // Test the burn function
        await contract.burn(accounts[1], 50);

        // Check that the balance of the account was updated correctly
        const balance = await contract.balanceOf(accounts[1]);
        assert.equal(balance, 50, "Incorrect balance after burning");
    });

    it("should only allow the owner to set the bridge address", async function () {
        // Test that the bridge address can only be set by the owner
        try {
            await contract.setBridge(accounts[1], { from: accounts[1] });
            assert.fail("Non-owner was able to set the bridge address");
        } catch (error) {
            assert.include(
                error.message,
                "Ownable: caller is not the owner",
                "Incorrect error message"
            );
        }

        // Test that the owner can set the bridge address
        await contract.setBridge(accounts[1]);
    });
});

contract("EthToken", function (accounts) {
    let contract;

    beforeEach(async function () {
        // Deploy a new instance of the EthToken contract before each test
        contract = await EthToken.new("Test Eth Token", "TET");
    });

    it("should mint tokens correctly", async function () {
        // Test the mint function
        await contract.mint(accounts[1], 100);

        // Check that the balance of the account was updated correctly
        const balance = await contract.balanceOf(accounts[1]);
        assert.equal(balance, 100, "Incorrect balance after minting");
    });

    it("should burn tokens correctly", async function () {
        // First, mint some tokens to the contract
        await contract.mint(accounts[1], 100);

        // Test the burn function
        await contract.burn(accounts[1], 50);

        // Check that the balance of the account was updated correctly
        const balance = await contract.balanceOf(accounts[1]);
        assert.equal(balance, 50, "Incorrect balance after burning");
    });

    it("should only allow the owner to set the bridge address", async function () {
        // Test that the bridge address can only be set by the owner
        try {
            await contract.setBridge(accounts[1], { from: accounts[1] });
            assert.fail("Non-owner was able to set the bridge address");
        } catch (error) {
            assert.include(
                error.message,
                "Ownable: caller is not the owner",
                "Incorrect error message"
            );
        }

        // Test that the owner can set the bridge address
        await contract.setBridge(accounts[1]);
    });
});
