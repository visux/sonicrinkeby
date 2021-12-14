import React, { useContext, useEffect, useMemo, useState,Component } from 'react'
import UAuth from '@uauth/js'
import UAuthSPA  from '@uauth/js'
import * as UAuthWeb3Modal from '@uauth/web3modal'
import Web3 from "web3";
import Token from '../abis/Token.json'
import EthSwap from '../abis/EthSwap.json'
import Main from './Main.js'
import Navbar from './Navbar.js'
import './App.css'
import WalletConnectProvider from "@walletconnect/web3-provider";
import metamaskLogo from './providers/logos/metamask.png'
import walletconnectLogo from './providers/logos/walletconnect.svg'
import Web3Modal, {
  CLOSE_EVENT,
  CONNECT_EVENT,
  ERROR_EVENT,
  ICoreOptions,
} from 'web3modal'
import {IUAuthOptions} from '@uauth/web3modal'
import $ from "jquery";


export const uauth = {
  clientID: 'LVSrxQ8RYl9sKf//nXs3AiT5/jIZuF9kf4aoN0PHc1k=',
  clientSecret: 'Jnja2HUSIvnH2va87FbAvhYBvr0RSGLtqSxFPPdpVOE=',
  redirectUri: 'https://swap.sonikchain.com',
  fallbackIssuer: 'https://auth.unstoppabledomains.com',
        scope: 'openid wallet',
};

class App extends Component {
  
  

  async componentWillMount() {
 
     await this.loadWeb3()
	   await this.loadBlockchainData()
  }

  async loadWeb3() {

    

    /*const uauth = new UAuth({
      clientID: "LVSrxQ8RYl9sKf//nXs3AiT5/jIZuF9kf4aoN0PHc1k=",
      clientSecret: "Jnja2HUSIvnH2va87FbAvhYBvr0RSGLtqSxFPPdpVOE=",
      redirectUri: "https://swap.sonikchain.com",
      scope: 'openid email wallet client_id',
      fallbackIssuer: 'https://auth.unstoppabledomains.com',
      shouldLoginWithRedirect: true
    })*/

    const onClose = () => {
      console.log('provider.close')
  
      //setProvider(undefined)
      //setAddress(undefined)
    }

    const providerOptions = {
      
      injected: {
        display: {
          logo: metamaskLogo,
          name: "Metamask",
          description: "Connect to your Metamask Wallet"
        },
        package: null
      },
     "custom-uauth": {
        options: uauth,
        display: UAuthWeb3Modal.display,
        connector: UAuthWeb3Modal.connector,
        package: UAuthSPA 
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

    /*
    uauth.loginCallback()
    .then(() => {
      console.log("OK");
      // Redirect to success page
    })
    .catch(error => {
      // Redirect to failure page
      console.log("NO");
    });  */
    
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
    UAuthWeb3Modal.registerWeb3Modal(web3Modal)
    
    
    //await window.web3.currentProvider.enable();
    //window.web3 = new Web3(window.web3.currentProvider);
    const provider =  await web3Modal.connect();
    //const provider = await web3Modal.connectTo('custom-uauth')

    /*UAuthWeb3Modal.getUAuth(UAuthSPA, uauth)
    .loginCallback()
    .then(async () => {
      const provider = await web3Modal.connectTo('custom-uauth')

     //  const provider =  await web3Modal.connectTo("custom-uauth");

  
})
  .catch(error => {
    // Redirect to failure page
  })
      */  
        
        
        // Save provider in state and redirect to success page
     
    //console.log(web3Modal.cachedProvider);

    /*if (web3Modal.cachedProvider === 'custom-uauth') {
      const userok = await uauth.user();
      console.log(userok);
      // setUser(await uauth.user())
    }*/
    /*if (web3Modal.cachedProvider === 'custom-uauth') {
      const userok = await uauth.user();
      console.log(userok);
    }*/

    // Subscribe to provider connection
    /*  provider.on("connect", (info ) => {
        console.log(info);
      });*/

      // Subscribe to provider disconnection
      /*provider.on("disconnect", (error: { code: number; message: string }) => {
        console.log(error);
      });
    
    provider.on('connect', (accounts) => {
      this.loadBlockchainData()
      console.log(accounts);
    });  */ 

    //provider.on('close', onClose)
    /*provider.on('connect', (accounts) => {
      this.loadBlockchainData()
      console.log(accounts);
    });*/
    provider.on("accountsChanged", (accounts) => {
      this.loadBlockchainData()
      console.log(accounts);
    });   
    provider.on("chainChanged", (chainId) => {
      this.loadBlockchainData()
      console.log(chainId);
    });
    
    provider.on("networkChanged", (networkId) => {
      
      if (networkId != 137){
        networkId = 5777
      } 
      this.setState({ networkID: networkId })	;
      this.loadBlockchainData()
      console.log(networkId);
    });

    provider.on("disconnect", (code, reason) => {
      this.componentWillMount()
      //this.loadBlockchainData()
      //this.loadBlockchainData() 
      //console.log(code, reason);
    
     
    });

    window.web3 = new Web3(provider);

  

    
/*
    useEffect(() => {
      const onErrorEvent = (error) => {
        console.error('web3modal.ERROR_EVENT', error)
        //setError(error)
      }
  
      const onCloseEvent = () => {
        console.log('web3modal.CLOSE_EVENT')
      }
  
      const onConnectEvent = async (provider) => {
        console.log('web3modal.CONNECT_EVENT', provider)
      }
  
      console.log('Attaching event listeners to web3modal!')
      web3Modal.on(ERROR_EVENT, onErrorEvent)
      web3Modal.on(CLOSE_EVENT, onCloseEvent)
      web3Modal.on(CONNECT_EVENT, onConnectEvent)
  
      return () => {
        console.log('Removing event listeners to web3modal!')
        web3Modal.off(ERROR_EVENT, onErrorEvent)
        web3Modal.off(CLOSE_EVENT, onCloseEvent)
        web3Modal.off(CONNECT_EVENT, onConnectEvent)
      }
    }, [web3Modal])*/


    

	  
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
    
    
    let networkId = await web3.eth.net.getId()
    if (networkId === 1)  networkId =5777;
    this.setState({ networkID : networkId })
	  networkId = this.state.networkID;
	
    if (networkId === 137){
      this.setState({ networkString: 'POLYGON' })
    }else{
      this.setState({ networkString: 'ETHEREUM' })
    }
  

/*
    const chainId = await ethereum.request({ method: 'eth_chainId' });
    handleChainChanged(chainId);

    ethereum.on('chainChanged', handleChainChanged);

    function handleChainChanged(_chainId) {
      // We recommend reloading the page, unless you must do otherwise
      window.location.reload();
    }*/
    //Load Token
    //const networkId = 'rinkeby'
   // const networkId = await web3.eth.net.getId()
	  //await  web3.eth.net.getId()
	//await  web3.eth.net.getId() 5777
    
	 //const networkId = 5777;
    //const networkId = window.ethereum.request({ method: 'net_version' })
    //const networkId = await web3.eth.net.getId();
    //if (networkId === 1)  networkId =5777;
    
    const chainId = await web3.eth.getChainId();
    console.log(networkId);
    console.log(chainId);
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
	  networkID: '0',
	  networkString: 'ETHEREUM',
	  logogen :{},
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
	  networkID={this.state.networkID}
	  networkString={this.state.networkString}
     
      />
    }
    return (
      <div>
        <Navbar account={this.state.account}/>
          <div className="container-fluid mt-5">
        
          <h1 className="mainWordmark">Smart DEX Swap</h1>
          <h4 className="mainHeader">Next generation PROTOCOL ERC777 by {' '}
           <a href="https://www.sonikchain.com" target="_blank" rel="noopener noreferrer">Sonikchain</a></h4>
         
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



