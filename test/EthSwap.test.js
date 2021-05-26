const { assert } = require("chai")
const { default: Web3 } = require("web3")

const Token = artifacts.require("Token")
const EthSwap = artifacts.require("EthSwap")

require("chai")
  .use(require("chai-as-promised"))
  .should()

const tokens = (n) => {
  return web3.utils.toWei(n, "ether")
}

contract("EthSwap", ([deployer, investor]) => {
  //this gets called before the tests get ran so that every test has access to these variables

  let token, ethSwap

  before(async () => {
    token = await Token.new()
    ethSwap = await EthSwap.new(token.address)
    //transfer all tokens to eth swap
    await token.transfer(ethSwap.address, tokens("1000000"))
  })

  describe("Token deployment", async () => {
    it("token has a name", async () => {
      const name = await token.name()
      assert.equal(name, "DApp Token")
    })
  })

  describe("EthSwap deployment", async () => {
    it("contract has a name", async () => {
      const name = await ethSwap.name()
      assert.equal(name, "EthSwap Instant Exchange")
    })

    it("contract has tokens", async () => {
      let balance = await token.balanceOf(ethSwap.address)
      assert.equal(balance.toString(), tokens("1000000"))
    })
  })

  describe("Buy Tokens", async () => {
    let result
    before(async () => {
      //purchase tokens before example
      result = await ethSwap.buyTokens({
        from: investor,
        value: web3.utils.toWei("1", "ether"),
      })
    })

    it("allows user to instantly buy tokens from eth swap for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), tokens("100"))

      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens("999900"))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("1", "ether"))

      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens("100").toString())
      assert.equal(event.rate.toString(), "100")
    })
  })
  describe("Sell Tokens", async () => {
    let result
    before(async () => {
      //investor must approve the tokens
      await token.approve(ethSwap.address, tokens("100"), { from: investor })
      //investor sells tokens
      result = await ethSwap.sellTokens(tokens("100"), { from: investor })
    })

    it("allows user to instantly sell tokens to eth swap for a fixed price", async () => {
      let investorBalance = await token.balanceOf(investor)
      assert.equal(investorBalance.toString(), "0")
      let ethSwapBalance
      ethSwapBalance = await token.balanceOf(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), tokens("1000000"))
      ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
      assert.equal(ethSwapBalance.toString(), web3.utils.toWei("0", "ether"))

      //Check logs that the event was emmited with correct data
      const event = result.logs[0].args
      assert.equal(event.account, investor)
      assert.equal(event.token, token.address)
      assert.equal(event.amount.toString(), tokens("100").toString())
      assert.equal(event.rate.toString(), "100")

      //Failure: investor cant sell more tokens than they have
      await ethSwap.sellTokens(tokens("500"), { from: investor }).should.be
        .rejected
    })
  })
})
