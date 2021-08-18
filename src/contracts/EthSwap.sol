// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;
import "./Token.sol";
import "@chainlink/contracts/src/v0.5/interfaces/AggregatorV3Interface.sol";

contract EthSwap  {
    
    string public name = "Eth Sonic Swap";
    SonicERC777 public token;
    uint rate = 200000; //1 ether = 200000 tokens
	int public priceETHUSD;
	uint public priceSON = 0.01 * 10**8;
   
	
   address payable public wallet = 0xaD07D7B4Cb9Cf4D05b705D2A39582395aD0A0598;
   
   AggregatorV3Interface internal priceFeed;

    event TokensPurchased (
        address account,
        address token,
        uint amount,
        uint rate
    );

    event TokensSold (
        address account,
        address token,
        uint amount,
        uint rate
    );

    constructor(SonicERC777 _token) public  {
        token = _token;
        // MAINNET
        //priceFeed = AggregatorV3Interface(0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419);
        // RINKEBY
        priceFeed = AggregatorV3Interface(0x8A753747A1Fa494EC906cE90E9f37563A8AF630e);
        // KOVAN
        //priceFeed = AggregatorV3Interface(0x9326BFA02ADD2366b30bacB125260Af641031331);
        
    }
    
    function getThePrice() public view returns (int) {
        (
            uint80 roundID, 
            int price,
            uint startedAt,
            uint timeStamp,
            uint80 answeredInRound
        ) = priceFeed.latestRoundData();
        return price;
    }
  
	function() external payable {
        buyTokens();
    }
    
    function buyTokens() public payable {
       
        priceETHUSD= getThePrice() / 10 ** 8; 
        rate = ( uint(priceETHUSD) / priceSON ) * 10 ** 8;
        uint tokenAmount = msg.value * rate;
        require(token.balanceOf(address(this)) >= tokenAmount);
        token.transfer(msg.sender, tokenAmount);

        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
		
		_forwardFunds();
    }
  
    function _forwardFunds() internal {
      wallet.transfer(address(this).balance);
    }
    

    function sellTokens(uint _amount) public {
        priceETHUSD= getThePrice() / 10 ** 8; 
        rate = ( uint(priceETHUSD) / priceSON ) * 10 ** 8;
        uint etherAmount = _amount/rate;
        require(address(this).balance >= etherAmount);

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
	
	
}