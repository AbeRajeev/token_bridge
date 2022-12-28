import { useState, useEffect } from 'react'
import { Row, Spinner } from 'react-bootstrap'
import { ethers } from "ethers"
import './App.css'

// Import Components
import Navbar from './Navbar'

// Import Contract's JSON
import EthToken from '../abis/EthToken.json';
import EthBridge from '../abis/EthBridge.json';
import PolToken from '../abis/PolToken.json';
import PolBridge from '../abis/PolBridge.json';

function App() {
  const [networkId, setNetworkId] = useState(null)
  const [otherNetwork, setOtherNetwork] = useState("")

  const [ethProvider, setEthProvider] = useState(null)
  const [polProvider, setPolProvider] = useState(null)

  const [ethBridge, setEthBridge] = useState(null)
  const [polBridge, setPolBridge] = useState(null)

  const [ethToken, setEthToken] = useState(null)
  const [polToken, setPolToken] = useState(null)

  const [account, setAccount] = useState(null)
  const [ethSigner, setEthSigner] = useState(null)
  const [polSigner, setPolSigner] = useState(null)

  const [amount, setAmount] = useState(0)

  const [isLoading, setIsLoading] = useState(true)
  const [hasProcessed, setHasProcessed] = useState(false)
  const [message, setMessage] = useState("Awaiting MetaMask Connection...")

  const loadWeb3 = async () => {
    console.log('called')

    if (window.ethereum.networkVersion === '5') {
      // Set provider for Rinkeby (MetaMask)
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum)
      setEthProvider(ethProvider)

      // Set provider for BSC Testnet
      //const bscProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545')
      //setBSCProvider(bscProvider)

      // Set provider for Mumbai Testnet
      //const polProvider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com')
      //const polProvider = new ethers.providers.JsonRpcProvider('https://rpc-mumbai.maticvigil.com/v1/<API_KEY>')
      const polProvider = new ethers.providers.JsonRpcProvider(`https://polygon-mumbai.g.alchemy.com/v2/${process.env.REACT_APP_ALCHEMY_API_KEY}`)
      console.log(polProvider)
      setPolProvider(polProvider)

      // Set signer
      const ethSigner = ethProvider.getSigner()
      setEthSigner(ethSigner)

      //setOtherNetwork("Binance")
      setOtherNetwork("Mumbai")

      await loadContracts()
    }

    // Mumbai Testnet
    if (window.ethereum.networkVersion === '80001') {
      // Set provider for Mumbai Testnet (MetaMask)
      const polProvider = new ethers.providers.Web3Provider(window.ethereum)
      setPolProvider(polProvider)

      // Set provider for Goerli Testnet
      //const ethProvider = new ethers.providers.JsonRpcProvider(process.env.INFURA_GOERLI_HTTPS)
      const ethProvider = new ethers.providers.JsonRpcProvider(`https://goerli.infura.io/v3/${process.env.REACT_APP_INFURA_API_KEY}`)
      console.log(ethProvider)
      setEthProvider(ethProvider)

      // Set signer
      const polSigner = polProvider.getSigner()
      setPolSigner(polSigner)

      setOtherNetwork("Goerli")

      await loadContracts()
    }

    if (window.ethereum.networkVersion === '5777') { // Any other network
      // Set provider for Mumbai Testnet (MetaMask)
      const polProvider = new ethers.providers.Web3Provider(window.ethereum)
      setPolProvider(polProvider)

      // Set provider for Goerli Testnet
      const ethProvider = new ethers.providers.Web3Provider(window.ethereum)
      setEthProvider(ethProvider)

      // Set signer
      const ethSigner = ethProvider.getSigner()
      setEthSigner(ethSigner)

      await loadContracts()
    }

    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    })

    window.ethereum.on('accountsChanged', function (accounts) {
      setAccount(accounts[0])
    })
  }

  const loadContracts = async () => {
    if (!ethProvider && !polProvider) {
      return
    }

    if (networkId !== '5777') {
      setMessage("Loading Contracts...")

      const ethBridge = new ethers.Contract(EthBridge.networks[5].address, EthBridge.abi, ethProvider)
      setEthBridge(ethBridge)

      const polBridge = new ethers.Contract(PolBridge.networks[80001].address, PolBridge.abi, polProvider)
      setPolBridge(polBridge)

      const ethTokenAddress = await ethBridge.token()
      const ethToken = new ethers.Contract(ethTokenAddress, EthToken.abi, ethProvider)
      setEthToken(ethToken)

      const polTokenAddress = await polBridge.token()
      const polToken = new ethers.Contract(polTokenAddress, PolToken.abi, polProvider)
      setPolToken(polToken)

      // Depending on the network, we listen for when tokens are burned from the bridgeto mint 
      // tokens on the other network... This is only for demonstration, for security it's more ideal to
      // have this specific logic on a server somewhere else, with a more secure implementation in place
      // incase of potential downtime (or if a user refreshes the page)!

      // If networkId === 5 (Goerli), listen to transfer events from the ETHBridge, then make a call to BSCBridge
      if (networkId === '5') {
        ethBridge.on('Transfer', async (from, to, amount, date, nonce, signature, step) => {
          const polWallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY)
          const polSigner = polWallet.connect(polProvider)
          const bridge = polBridge.connect(polSigner)

          // Call mint function from here...
          await bridge.mint(from, to, amount, nonce, signature)

          setHasProcessed(true)
          setIsLoading(false)
        })
      }

      // If networkId === 80001 (Mumbai), listen to transfer events from the BSCBridge, then make a call to ETHBridge
      if (networkId === '80001') {
        polBridge.on('Transfer', async (from, to, amount, date, nonce, signature, step) => {
          const ethWallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY)
          const ethSigner = ethWallet.connect(ethProvider)
          const bridge = ethBridge.connect(ethSigner)

          // Call mint function from here...
          await bridge.mint(from, to, amount, nonce, signature)

          setHasProcessed(true)
          setIsLoading(false)
        })
      }
    } else if (networkId === '5777') {

      // If testing on localhost, setup contracts on same network...
      const ethBridge = new ethers.Contract(EthBridge.networks[5777].address, EthBridge.abi, ethProvider);
      setEthBridge(ethBridge)

      const polBridge = new ethers.Contract(PolBridge.networks[5777].address, PolBridge.abi, ethProvider);
      setPolBridge(polBridge)

      ethBridge.on('Transfer', async (from, to, amount, date, nonce, signature, step) => {
        const polWallet = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY)
        const polSigner = polWallet.connect(polProvider)
        const bridge = polBridge.connect(polSigner)

        // Call mint function from here...
        await bridge.mint(from, to, amount, nonce, signature)

        setHasProcessed(true)
        setIsLoading(false)
      })
    } else {
      return
    }
    setIsLoading(false)
  }

  // MetaMask Login/Connect
  const web3Handler = async () => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    setAccount(accounts[0])
    setNetworkId(window.ethereum.networkVersion)
  }

  const bridgeHandler = async () => {
    const amountInWei = ethers.utils.parseUnits(amount.toString(), 'ether')

    if (networkId === '5') { // Goerli Testnet
      // Connect account with contract...
      const bridge = await ethBridge.connect(ethSigner)
      const id = await bridge.transferCount(account)

      // Create hash message, and have user sign it...
      const hashedMessage = ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], [account, amountInWei, (Number(id) + 1)])
      const other = ethers.utils.arrayify(hashedMessage)
      const signature = await ethSigner.signMessage(other)

      setMessage("Bridging over... Do NOT refresh the page!")
      setIsLoading(true)

      // Burn tokens...
      await bridge.burn(account, amountInWei, signature)
    }

    if (networkId === '80001') { // Mumbai Testnet
      // Connect account with contract...
      const bridge = await polBridge.connect(polSigner)
      const id = await bridge.transferCount(account)

      // Create hash message, and have user sign it...
      const hashedMessage = ethers.utils.solidityKeccak256(["address", "uint256", "uint256"], [account, amountInWei, (Number(id) + 1)])
      const other = ethers.utils.arrayify(hashedMessage)
      const signature = await polSigner.signMessage(other)

      setMessage("Bridging over... Do NOT refresh the page!")
      setIsLoading(true)

      // Burn tokens...
      await bridge.burn(account, amountInWei, signature)
    }
  }

  const addTokenHandler = async () => {
    let address

    if (networkId === '5') { // Goerli Testnet
      address = ethToken.address
    }

    if (networkId === '80001') { // Mumbai Testnet
      console.log(polToken)
      address = polToken.address
    }

    /* if (networkId === '97') { // Binance Testnet
      console.log(bscToken)
      address = bscToken.address
    } */

    await window.ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: address,
          symbol: "RWSTR",
          decimals: 18,
        },
      },
    })
  }

  const changeNetworkHandler = async () => {
    let chainId

    if (networkId === '5') { // Goerli
      chainId = '0x5'
    }
    if (networkId === '80001') { // Mumbai
      chainId = '0x13881'
    }

    /* if (networkId === '4') { // Rinkeby
      chainId = '0x61'
    }

    if (networkId === '97') { // Binance Testnet
      chainId = '0x4'
    } */

    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: chainId }],
    })
  }

  useEffect(() => {
    loadWeb3()
  }, [account, networkId]);

  return (
    <div className="App">

      <Navbar web3Handler={web3Handler} account={account} />

      {isLoading ? (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <Spinner animation="border" style={{ display: 'flex' }} />
          <p className='mx-3 my-0'>{message}</p>
        </div>
      ) : (
        <main className='p-3'>
          <h1 className='my-4'>Token Bridge DApp</h1>
          <hr />
          <Row className='text-center'>
            <h2>Bridge your funds</h2>
            <div>
              <input type="number" onChange={(e) => { setAmount(e.target.value) }} placeholder='Amount' />
              <button onClick={bridgeHandler} className='button btn-sm mx-3'>{`Bridge to ${otherNetwork}`}</button>
            </div>
          </Row>
          <hr />
          <Row className='text-center'>
            {networkId === '5' ? (
              <div>
                <p>Currently connected to Goerli</p>
                <button onClick={addTokenHandler} className='button btn-sm p-2'>Add Token to MetaMask</button>
              </div>
            ) : networkId === '80001' ? (
              <div>
                <p>Currently connected to Mumbai Testnet</p>
                <button onClick={addTokenHandler} className='button btn-sm p-2'>Add Token to MetaMask</button>
              </div>
            ) : (
              <p>Unidentified network, please connect to Goerli or Mumbai Testnet</p>
            )}
          </Row>
          {hasProcessed ? (
            <Row className='text-center'>
              <div>
                <button onClick={changeNetworkHandler} className='button btn-sm'>Switch Network</button>
              </div>
            </Row>
          ) : (
            <Row></Row>
          )}
        </main>
      )}
    </div>
  );
}

export default App;
