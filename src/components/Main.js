import React, { useState } from "react"
import Web3 from "web3"
const Main = ({ user, buyTokens }) => {
  //redeclare web3 object
  const web3 = new Web3(Web3.givenProvider || "http://localhost:7545")

  const [etherAmount, setEtherAmount] = useState("0")
  const [tokenAmount, setTokenAmount] = useState("0")

  return (
    <div id="content">
      <div className="card mb-4">
        <div className="card-body">
          <form
            className="mb-3"
            onSubmit={(event) => {
              event.preventDefault()
              const convertedEther = web3.utils.toWei(etherAmount, "Ether")
              buyTokens(convertedEther)
            }}
          >
            <div>
              <label className="float-left">
                <b>Input</b>
              </label>
              <span className="float-right text-muted">
                Balance: {web3.utils.fromWei(user.balance, "ether")}{" "}
              </span>
            </div>
            <div className="input-group mb-4">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                required
                onChange={(e) => {
                  setEtherAmount(e.target.value.toString())
                  setTokenAmount((e.target.value * 100).toString())
                }}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  {/* <img src={ethLogo || "test"} height="32" alt="" /> */}
                  ETH
                </div>
              </div>
            </div>
            <div>
              <label className="float-left">
                <b>Output</b>
              </label>
              <span className="float-right text-muted">
                Balance: {web3.utils.fromWei(user.tokenBalance, "ether")}{" "}
              </span>
            </div>
            <div className="input-group mb-2">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="0"
                disabled
                onChange={(e) => {
                  setTokenAmount(e.target.value.toString())
                  setEtherAmount(e.target.value.toString() / 100)
                }}
                value={tokenAmount}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  {/* <img src={tokenLogo} height="32" alt="" /> */}
                  DApp
                </div>
              </div>
            </div>
            <div className="mb-5">
              <span className="float-left text-muted">Exchange Rate</span>
              <span className="float-right text-muted">1 ETH = 100 DApp</span>
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg">
              SWAP!
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Main
