import React, { useEffect, useState } from "react"
import "./App.css"
import Web3 from "web3"
import Nav from "./Nav"
import detectEthereumProvider from "@metamask/detect-provider"
//contact import
import EthSwap from "../abis/EthSwap.json"
import Token from "../abis/Token.json"

const App = () => {
  const [provider, userProvider] = useState(undefined)
  const [tokenContract, setTokenContract] = useState(undefined)
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

    //Web3.givenProvider is the same as provider state just too lazy to change
    const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")
    const accounts = await web3.eth.getAccounts()

    console.log("accounts", accounts)
    //get the user balance
    const userEthBalance = await web3.eth.getBalance(accounts[0])

    setUser((user) => ({
      ...user,
      account: accounts[0],
      balance: userEthBalance,
    }))

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
  }
  return (
    <div>
      <Nav user={user} />
      <div className="container-fluid mt-5">
        <div className="row">
          <main role="main" className="col-lg-12 d-flex text-center">
            <h1>Hello </h1>
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
