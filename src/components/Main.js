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
        
        <button
          className="btn networkdefault" >
          <small id="networkdefault">DEX SWAP NETWORK: ETHEREUM MAINNET</small> 
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
