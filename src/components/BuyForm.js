import React, { Component } from 'react'
import tokenLogo from '../token-logo.png'
import ethLogo from '../eth-logo.png'
import maticLogo from '../matic-logo.png'
import bnbLogo from '../bnb-logo.png'

class BuyForm extends Component {

 
 constructor(props) {
    super(props)
    this.state = {
      output: '0',
	  logogen:{},
	  namegen:''
    }
  }


  

  render() {
    const aggregatorV3InterfaceABI = [{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"description","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint80","name":"_roundId","type":"uint80"}],"name":"getRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"latestRoundData","outputs":[{"internalType":"uint80","name":"roundId","type":"uint80"},{"internalType":"int256","name":"answer","type":"int256"},{"internalType":"uint256","name":"startedAt","type":"uint256"},{"internalType":"uint256","name":"updatedAt","type":"uint256"},{"internalType":"uint80","name":"answeredInRound","type":"uint80"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"version","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
     //const addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";  // MAINNET
	 // const addr = "0x8A753747A1Fa494EC906cE90E9f37563A8AF630e"; // RINKEBY
	 let addr = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0";  // MAINNET POLYGON MATIC
 
   if (this.props.networkID===5777){
	    this.state.logogen	 = ethLogo;
		this.state.namegen ='ETH';
		addr = "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419";  // MAINNET
	 }else if (this.props.networkID===56){
    this.state.logogen	 = bnbLogo; 
		this.state.namegen ='BNB';
		addr = "0x0567F2323251f0Aab15c8dFb1967E4e8A7D42aeE";  // MAINNET BINANCE BNB SMART CHAIN    
  }else if (this.props.networkID===97){
    this.state.logogen	 = bnbLogo; 
		this.state.namegen ='BNB';
		addr = "0x2514895c72f50D8bd4B4F9b1110F0D6bD2c97526";  // TESTNET BINANCE BNB SMART CHAIN    
   
  }else{ 
		this.state.logogen	 = maticLogo; 
		this.state.namegen ='MATIC';
		addr = "0xAB594600376Ec9fD91F8e885dADF0CE036862dE0";  // MAINNET POLYGON MATIC
	 }
	 
     
	 let  priceETHUSD = "";
     let priceSON;
     let rate ;
     const priceFeed = new window.web3.eth.Contract(aggregatorV3InterfaceABI, addr);
     priceFeed.methods.latestRoundData().call()
    .then((roundData) => {
        
        console.log("Latest Round Data", roundData)
        let exp=8;
       // if (this.props.networkID===56) exp=5;   
        priceSON = 0.01 * 10**exp;
        priceETHUSD = (roundData.answer/10**exp)
        console.log(priceETHUSD);

        console.log(priceSON);

        rate = ( priceETHUSD / priceSON ) * 10 ** exp;
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
			  <img src={this.state.logogen} height='32' alt=""/>
              &nbsp;&nbsp;&nbsp; {this.state.namegen}
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
