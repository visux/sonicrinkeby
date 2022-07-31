import React, { Component } from 'react'
import BuyForm from './BuyForm.js'
import SellForm from './SellForm.js'


class Main extends Component {

constructor(props) {
    super(props)
    this.state = {
        currentForm: 'buy'
    }
   
}

 addMetamask(){

    let tokenAddress='0xce659de292ad4fa9aafd82b038936cebd9291e77';
	  const tokenSymbol = 'SON';
    let tokenDecimals = 18;
      
    const tokenImage = 'https://swap.sonikchain.com/sonictok.png';
    if(this.props.networkID === 137) {
	    tokenAddress = '0x7f8813a8e203ee026c9c6a1ca380e0237488ceb8';
    }else if (this.props.networkID ===56 ) {
      tokenAddress = '0x0d51e158abe34321526305ea47d1ebaca16fd142';
    }

    try {
      
      const wasAdded =   window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress, 
            symbol: tokenSymbol, 
            decimals: tokenDecimals, 
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Successufull added!');
      } else {
        console.log('No meta image');
      }
    } catch (error) {
      console.log(error);
    }
  }

  addMetamaskBSC(){

    const tokenSymbol = 'SON';
    const tokenDecimals = 9;
    const tokenImage = 'https://swap.sonikchain.com/sonictok.png';
    let tokenAddress = '0xA3d64A57eBf6529586C56a2d44979Aaf061e8b58';
    //if (this.props.networkID ===97 ) tokenAddress = '0x922e07d6958a7046a7a5e6378bfe64e2de6f6542';

    try {
      
      const wasAdded =   window.ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: tokenAddress, 
            symbol: tokenSymbol, 
            decimals: tokenDecimals, 
            image: tokenImage,
          },
        },
      });

      if (wasAdded) {
        console.log('Successufull added!');
      } else {
        console.log('No meta image');
      }
    } catch (error) {
      console.log(error);
    }
  }

  switchToMainnet(){
  }

  switchToPolygon(){
  }
  
 
  render() {
	  

    let content
    if(this.state.currentForm === 'buy') {
        content=<BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
		networkID={this.props.networkID}
		networkString={this.props.networkString}
	
        />
    } else {
        content=<SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
		networkID={this.props.networkID}
		networkString={this.props.networkString}
        />
    }
	

	
    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3">
        <button id="addmeta" onClick={(event) => {
             if(this.props.networkID === 97){
               this.addMetamaskBSC();
             }else {
              this.addMetamask();
             }
              
            }}
            className="btn btn-primary btn-block btn-lg">ADD SONIC TO METAMASK</button>
         
        <button
          className="btn networkdefault" >
          <small id="networkdefault">NETWORK: {this.props.networkString} MAINNET</small> 
          </button>


        
        </div>

        <div className="card mb-4" >

          <div className="card-body">

            {content}

          </div>
        </div>        
      </div>
    );
  }
}

export default Main;
