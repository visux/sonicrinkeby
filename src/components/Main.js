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
    const tokenAddress = '0xce659de292ad4fa9aafd82b038936cebd9291e77';
    const tokenSymbol = 'SON';
    const tokenDecimals = 18;
    const tokenImage = 'https://swap.sonikchain.com/sonictok.png';

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

  
 
  render() {
    let content
    if(this.state.currentForm === 'buy') {
        content=<BuyForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        buyTokens={this.props.buyTokens}
        />
    } else {
        content=<SellForm
        ethBalance={this.props.ethBalance}
        tokenBalance={this.props.tokenBalance}
        sellTokens={this.props.sellTokens}
        />
    }
    return (
      <div id="content" className="mt-3">
        <div className="d-flex justify-content-between mb-3">
        <button id="addmeta" onClick={(event) => {
              this.addMetamask();
            }}
            className="btn btn-primary btn-block btn-lg">ADD SONIC TO METAMASK</button>
         
        <button
          className="btn networkdefault" >
          <small id="networkdefault">NETWORK: ETHEREUM MAINNET</small> 
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
