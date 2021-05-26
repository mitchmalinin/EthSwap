pragma solidity >=0.4.21 <0.6.0;

import "./Token.sol";

contract EthSwap {
  string public name = "EthSwap Instant Exchange";

  Token public token;
  uint256 public rate = 100;

  event TokensPurchased(
    address account,
    address token,
    uint256 amount,
    uint256 rate
  );

  event TokensSold(
    address account,
    address token,
    uint256 amount,
    uint256 rate
  );

  constructor(Token _token) public {
    token = _token;
  }

  function buyTokens() public payable {
    //redemption rate = # of tokens they recive for one ether
    //amount of ether * the redemtion rate
    //calculate the amount of tokens to by
    uint256 tokenAmount = msg.value * rate;

    //require that ethsawap has enough tokens
    require(token.balanceOf(address(this)) >= tokenAmount);

    //transfer tokens to the user
    token.transfer(msg.sender, tokenAmount);

    //emit an event
    emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
  }

  function sellTokens(uint256 _amount) public {
    //User cant sell more tokens than they have
    require(token.balanceOf(msg.sender) >= _amount);

    //calculate how much its worth in ether
    uint256 ethAmount = _amount / rate;

    //check the balance
    require(address(this).balance >= ethAmount);

    //preform sale
    msg.sender.transfer(ethAmount);

    //transfer back into account
    token.transferFrom(msg.sender, address(this), _amount);

    //emit an event
    emit TokensSold(msg.sender, address(token), _amount, rate);
  }
}
