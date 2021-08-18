pragma solidity ^0.5.0;
import "./Token.sol";

contract EthSwap  {
    
    string public name = "Eth Sonic Swap";
    SonicERC777 public token;
    uint rate = 20000; //1 ether = 20000 tokens
	
//	address payable public wallet = 0xaD07D7B4Cb9Cf4D05b705D2A39582395aD0A0598;
   address payable public wallet = 0x610Cfb8e639a5Cc6ED93c7D8BAdf5aDA330Bed43;

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
        
    }
	
	function() external payable {
        buyTokens();
    }

    function buyTokens() public payable {
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
        uint etherAmount = _amount/rate;
        require(address(this).balance >= etherAmount);

        token.transferFrom(msg.sender, address(this), _amount);
        msg.sender.transfer(etherAmount);

        emit TokensSold(msg.sender, address(token), _amount, rate);
    }
	
	
}