require('babel-register');
require('babel-polyfill');
require('dotenv').config();

//const HDWalletProvider = require('truffle-hdwallet-provider-privkey');
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 7545,            // Standard Ethereum port (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(
          [process.env.PRIVATE_KEY],
          process.env.INFURA_GOERLI_WSS // URL to Ethereum Node
        )
      },
      gasPrice: 60000000000, // 60 Gwei
      gas: 4000000,
      network_id: 5
    },
    mumbai: {
      provider: function () {
        return new HDWalletProvider(
          [process.env.PRIVATE_KEY],
          process.env.ALCHEMY_MUMBAI_WSS // URL to Ethereum Node
        )
      },
      gasPrice: 60000000000, // 60 Gwei
      gas: 4000000,
      network_id: 80001,       // Mumbai's id
      //confirmations: 2,    // # of confirmations to wait between deployments. (default: 0)
      //timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
      //skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
    },

  },

  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.17", // Fetch exact version from solc-bin (default: truffle's version)
      optimizer: {
        enabled: false,
        runs: 200
      },
      //  evmVersion: "byzantium"
      // }
    }
  },
};
