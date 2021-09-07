import React, { Component } from 'react'


import Web3 from "web3";
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Main from './Main.js'
import Navbar from './Navbar.js'
import './App.css'
import WalletConnectProvider from "@walletconnect/web3-provider";
import metamaskLogo from './providers/logos/metamask.png'
import walletconnectLogo from './providers/logos/walletconnect.svg'
import Web3Modal from "web3modal";
import $ from "jquery";

class App extends Component {
  
  async componentWillMount() {
     
     await this.loadWeb3()
     await this.loadBlockchainData()
  }

  async loadWeb3() {
   
    

    const providerOptions = {
      
      injected: {
        display: {
          logo: metamaskLogo,
          name: "Metamask",
          description: "Connect to your Metamask Wallet"
        },
        package: null
      },
     
      walletconnect: {
        display: {
          logo:  walletconnectLogo,
          name: "WalletConnect",
          description: "Scan with WalletConnect to connect"
        },
        package: WalletConnectProvider,
        options: {
          infuraId: "e9de165b048446448a63b212962230d3" // required
        }
      }
    };
    
    const web3Modal = new Web3Modal({
      network: "mainnet", // optional
      cacheProvider: false, // optional
      providerOptions, // required
      disableInjectedProvider: false,
      theme: {
        background: "#031c37",
        main: "#00ff73",
        secondary: "#f2f2f2",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "#760cc8"
      }
    
    });
    installMetamask();
    //await window.web3.currentProvider.enable();
    //window.web3 = new Web3(window.web3.currentProvider);
    const provider =  await web3Modal.connect();
        
    provider.on("accountsChanged", (accounts) => {
      this.loadBlockchainData()
      console.log(accounts);
    });
    
    provider.on("chainChanged", (chainId) => {
      this.loadBlockchainData()
      console.log(chainId);
    });
    
    provider.on("networkChanged", (networkId) => {
      this.loadBlockchainData()
      console.log(networkId);
    });

    provider.on("disconnect", (code, reason) => {
      //this.loadBlockchainData() 
      console.log(code, reason);
    });
    /*provider.on("connect", (info: { chainId: number }) => {
      console.log(info);
    });
    
    provider.on("disconnect", (error: { code: number; message: string }) => {
      console.log(error);
    });*/
    window.web3 = new Web3(provider);
    
    
   /* const { ethereum } = window;
    if (ethereum && ethereum.isMetaMask) {
      console.log('Ethereum successfully detected!');
      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      const oldProvider = window.web3.currentProvider; // keep a reference to metamask provider

      window.web3 = new Web3(oldProvider);
    } else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }*/

  /* if (window.ethereum) {   //BUONA
     window.web3 = new Web3(window.ethereum);
     await window.ethereum.enable();
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }*/



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
      
    function installMetamask() {
     //if (!(window.web3 || window.ethereum)) {
        if ($('#installMetaMask').length < 1){
          $('.web3modal-modal-card').prepend('<div id="installMetaMask" class="cjAFRf web3modal-provider-wrapper jATXJA"><a href="https://metamask.io/" target="_blank" class="sc-hKFyIo gASkQ web3modal-provider-container"><div class="sc-bdnylx jMhaxE web3modal-provider-icon"><img src="" alt="MetaMask"></div><div class="sc-gtssRu kfKIgv sc-web3modal-provider-name mt-0">Install MetaMask</div><div class="sc-dlnjPT cZGiur web3modal-provider-description">Connect using browser wallet</div></a></div>')
          $('.web3modal-modal-card div#installMetaMask a img').attr("src", metamaskLogo);
        }
      //}
    }
   
  }
  
  
  
  async loadBlockchainData() {
    const web3 = window.web3;
    //const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
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
      content =  <Main 
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
