npx create-react-app token_bridge
-truffle init
-re-arrange the folder structure

npm install @openzeppelin/contracts
npm install ethers
npm i @truffle/hdwallet-provider
npm install assert chai chai-as-promised bootstrap web-vitals
npm i truffle-hdwallet-provider-privkey

npm install bootstrap react-bootstrap

npm install babel-polyfill babel-preset-env babel-preset-es2015 babel-preset-stage-2 babel-preset-stage-2 babel-preset-stage-3 babel-register

---

1. Update the Truffle config file
2. Migration file needs to be updated
3. Start with the contracts
4. Uint tests
5. Front end - React App.js

Deployment
truffle migrate --reset --network goerli //deploying on goerli testnet, use newly created WSS URLs for faster connection - 3 deployments
truffle migrate --reset --network mumbai //deploying on mumbai testnet, use newly created WSS URLs for faster connection - 3 deployments

Start the App
npm run start

Deployment addresses:
Goerli:

Migrations - 0xA01DCee949Ed6127663C3913FDb445b9a869059F
EthToken - 0xBbC8DDaE3AC101ADab843bD72A50ED7c38c27add
EthBridge - 0xCed9e2301a405c6a7076879a7719734BA00b2396

Mumbai:

Migrations - 0x17f0A4e6618a773fFc7B5fc7dDc0136eA1b0278E
PolToken - 0x0fAd124b5e00Ab0C51393ecF426c6546B7374FD8
PolBridge - 0x59BbA71cb24798E09959Bc3d27f64A395Dc2E757
