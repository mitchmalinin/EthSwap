import React, { useEffect, useState } from "react"
import "./App.css"
import Web3 from "web3"
import Nav from "./Nav"
import Main from "./Main"
import detectEthereumProvider from "@metamask/detect-provider"
//contact import
import EthSwap from "../abis/EthSwap.json"
import Token from "../abis/Token.json"

const App = () => {
  const [loading, setLoading] = useState(false)
  const [provider, userProvider] = useState(undefined)
  const [tokenContract, setTokenContract] = useState(undefined)
  const [ethSwapContract, setEthSwapContract] = useState(null)
  const [user, setUser] = useState({
    account: "",
    balance: "",
    tokenBalance: "0",
  })

  useEffect(() => {
    detectEthProvider()
    loadBlockchainData()
  }, [])

  const detectEthProvider = async () => {
    setLoading(true)
    const scopedProvider = await detectEthereumProvider()
    if (scopedProvider) {
      // From now on, this should always be true:
      // provider === window.ethereum
      userProvider(scopedProvider)
    } else {
      console.log("Please install MetaMask!")
    }
  }

  const loadBlockchainData = async () => {
    //you cant do window.web3 anymore because of secuirity vulnerbilites
    setLoading(true)
    //Web3.givenProvider is the same as provider state just too lazy to change
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.getAccounts()

    //checks if an account is connected
    if (accounts.length === 0) {
      alert("please connect a account")
    }
    //get the user balance
    const userEthBalance = await web3.eth.getBalance(accounts[0])

    setUser((user) => ({
      ...user,
      account: accounts[0],
      balance: userEthBalance,
    }))

    //LOAD THE TOKEN
    //get the network id
    const networkId = await web3.eth.net.getId()
    //get network id
    const tokenData = Token.networks[networkId]
    //create the token contract in js to that we can use it on the frontend
    if (tokenData) {
      let token = new web3.eth.Contract(Token.abi, tokenData.address)
      let tokenBalance = await token.methods.balanceOf(accounts[0]).call()
      setUser((user) => ({ ...user, tokenBalance: tokenBalance.toString() }))
      setTokenContract(token)
    } else {
      window.alert("token contract not deployed to detected network")
    }

    //LOAD ETHSWAP
    const ethSwapData = EthSwap.networks[networkId]
    //create the token contract in js to that we can use it on the frontend
    if (ethSwapData) {
      let ethSwap = new web3.eth.Contract(EthSwap.abi, ethSwapData.address)
      setEthSwapContract(ethSwap)
    } else {
      window.alert("EthSwap contract not deployed to detected network")
    }

    setLoading(false)
  }

  const buyTokens = (etherAmount) => {
    setLoading(true)
    ethSwapContract.methods
      .buyTokens()
      .send({
        from: user.account,
        value: etherAmount,
      })
      .on("transactionHash", (hash) => {
        setLoading(false)
        loadBlockchainData()
      })
  }
  return (
    <div>
      <Nav user={user} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main
            role="main"
            className="col-lg-12 mr-auto text-center justify-content-center "
            style={{ maxWidth: "600px" }}
          >
            <div className="content mr-auto ml-auto">
              {loading ? (
                <p className="text-center">Loading...</p>
              ) : (
                <Main user={user} buyTokens={buyTokens} />
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
