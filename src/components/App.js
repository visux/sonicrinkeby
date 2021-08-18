import React, { Component } from 'react'

import Web3 from "web3";
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Main from './Main.js'
import Navbar from './Navbar.js'
import './App.css'


class App extends Component {
  
  async componentWillMount() {
     await this.loadWeb3()
     await this.loadBlockchainData()
  }

  async loadWeb3() {
   

    /*const providerOptions = {
      // Example with injected providers
      injected: {
        display: {
          logo: "data:image/gif;base64,INSERT_BASE64_STRING",
          name: "Injected",
          description: "Connect with the provider in your Browser"
        },
        package: null
      },
      // Example with WalletConnect provider
      walletconnect: {
        display: {
          logo: "data:image/gif;base64,INSERT_BASE64_STRING",
          name: "Mobile",
          description: "Scan qrcode with your mobile wallet"
        },
        package: WalletConnectProvider,
        options: {
          infuraId: "INFURA_ID" // required
        }
      }
    };

    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: true, // optional
      providerOptions // required
    });

    const provider = await web3Modal.connect();

    const web3 = new Web3(provider);
*/


/*    const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const oldProvider = window.web3.currentProvider; // keep a reference to metamask provider

      window.web3 = new Web3(oldProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }*/

   if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }

  /*  const Web3 = require("web3");
      const ethEnabled = async () => {
        if (window.ethereum) {
          await window.ethereum.send('eth_requestAccounts');
          window.web3 = new Web3(window.ethereum);
          return true;
        }
        return false;
      }
*/
  }
  
  
  
  async loadBlockchainData() {
    const web3 = window.web3;
    
    const accounts = await web3.eth.getAccounts();
    this.setState({ account: accounts[0] })
    const ethBalance = await web3.eth.getBalance(accounts[0])
    this.setState({ ethBalance })
    
    //Load Token
    //const networkId = 'rinkeby'
   // const networkId = await web3.eth.net.getId()
	  //await  web3.eth.net.getId()
	//await  web3.eth.net.getId() 5777
    const networkId = 5777
    const tokenData = Token.networks[networkId]

    if(tokenData) {
      const token = new web3.eth.Contract(Token.abi, tokenData.address)
      this.setState({ token })
      const tokenBalance = await token.methods.balanceOf(this.state.account).call()
      if(tokenBalance != null){
	  this.setState({ tokenBalance: tokenBalance.toString() });
	  }else{
		   this.setState({ tokenBalance: "0" });
	  }
    } else {
      window.alert("Token contract not deployed to detected network")
    }

    //Load EthSwap
    const ethSwapData = EthSwap.networks[networkId]
    
    if(ethSwapData) {
      const ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      this.setState({ ethSwap })
    } else {
      window.alert("Swap dex contract not deployed to detected network")
    }

    this.setState({ loading: false })
  }
  
  constructor(props) {
    super(props)
    this.state = {
      loading: true,
      account: '',
      ethBalance: '0',
      tokenBalance: '0',
      token: {},
      ethSwap: {}
    }
  }

  buyTokens = (ethAmount) => {
    this.setState({ loading: true })
    this.state.ethSwap.methods.buyTokens().send({ from: this.state.account, value: ethAmount})
    .on('transactionHash', (hash) => {
      this.setState({ loading: false })
    })
  }

  sellTokens = (tokenAmount) => {
    this.setState({ loading: true })
    this.state.token.methods.approve(this.state.ethSwap.address, tokenAmount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.state.ethSwap.methods.sellTokens(tokenAmount).send({from: this.state.account})
    })
    this.setState({loading: false})
  }
 
 

  render() {
    let content
    if(this.state.loading) {
      content = <p id="loader" className="text-center">Loading...</p>
    } else {
      content = <Main 
      ethBalance={this.state.ethBalance} 
      tokenBalance={this.state.tokenBalance}
      buyTokens={this.buyTokens}
      sellTokens={this.sellTokens}
     
      />
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                { content }
          
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
