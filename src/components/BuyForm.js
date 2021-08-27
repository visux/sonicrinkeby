import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
//import WalletConnectProvider from "@walletconnect/web3-provider";
//import metamaskLogo from './providers/logos/metamask.png'
//import {useEffect, useState} from "react";
//import Link from 'next / link';
//import wallet_model from './models/wallet_model';

/*const {web3Loading, getweb3} = wallet_model ();
const [myWeb3, setMyWeb3] = useState ();

*/
//import Web3 from "web3";
//import Web3Modal from "web3modal";


/*
// Subscribe to accounts change
provider.on("accountsChanged", (accounts) => {
  console.log(accounts);
});

// Subscribe to chainId change
provider.on("chainChanged", (chainId) => {
  console.log(chainId);
});

// Subscribe to provider connection
provider.on("connect", (info: { chainId }) => {
  console.log(info);
});

// Subscribe to provider disconnection
provider.on("disconnect", (error: { code: number; message: string }) => {
  console.log(error);
});*/


class BuyForm extends Component {

 
 constructor(props) {
    super(props)
    this.state = {
      output: '0'
    }
  }



 
    
  

  render() {
    const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
     const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";  // MAINNET
	 // const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"; // RINKEBY
 
     let  priceETHUSD = "";
     let priceSON;
     let rate ;
     const priceFeed = new window.web3.eth.Contract(aggregatorV3InterfaceABI, addr);
     priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        
        console.log("Latest Round Data", roundData)
        
        priceSON = 0.01 * 10**8;
        priceETHUSD = (roundData.answer/10**8)
        console.log(priceETHUSD);

        console.log(priceSON);

        rate = ( priceETHUSD / priceSON ) * 10 ** 8;
        console.log(rate);
         
    });
    return (
   

      <form className="mb-3" onSubmit={(event) => {
          event.preventDefault()
          let etherAmount
          
		  
		 /* if (Number.isInteger(this.input.value)){
				// nothing
		  }else{
				alert("data is not an integer")
				return;
		  }*/
          etherAmount = this.input.value.toString()
          etherAmount = window.web3.utils.toWei(etherAmount, 'Ether')
          this.props.buyTokens(etherAmount)
        }}>  
        <div>
          <label className="float-left"><b>Input</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.ethBalance, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-4">
          <input
            type="text"
            onChange={(event) => {
              const etherAmount = this.input.value.toString()
              this.setState({
                output: etherAmount * rate
              })
            }}
            ref={(input) => { this.input = input }}
            className="form-control form-control-lg"
            placeholder="0"
            required />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={ethLogo} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; ETH
            </div>
          </div>
        </div>
        <div>
          <label className="float-left"><b>Output</b></label>
          <span className="float-right text-muted">
            Balance: {window.web3.utils.fromWei(this.props.tokenBalance, 'Ether')}
          </span>
        </div>
        <div className="input-group mb-2">
          <input
            type="text"
            className="form-control form-control-lg"
            placeholder="0"
            value={this.state.output}
            disabled
          />
          <div className="input-group-append">
            <div className="input-group-text">
              <img src={tokenLogo} height='32' alt=""/>
              &nbsp; SON
            </div>
          </div>
        </div>
        <div className="mb-5">
          <span className="float-left text-muted"></span>
          <span className="float-right text-muted"></span>
        </div>
        <button type="submit" className="btn btn-primary btn-block btn-lg">SWAP</button>
      </form>
    );

    /*async function connectWallet () {
      await getweb3 (). then ((response) => {
          setMyWeb3 (response);
          response.eth.getAccounts (). then ((result) => {
          console.log (result)
              });
          });
    };*/
  }


  
  
}

export default BuyForm;
