import React from "react"
import Identicon from "identicon.js"

const Nav = ({ user }) => {
  return (
    <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-10 shadow">
      <a
        className="navbar-brand col-sm-3 col-md-2 mr-0"
        href="http://www.dappuniversity.com/bootcamp"
        target="_blank"
        rel="noopener noreferrer"
      >
        Eth Swap
      </a>

      <ul className="navbar-nav px-3">
        <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
          <small className="text-secondary">
            <small id="account">{user.account}</small>
          </small>
          {user.account ? (
            <img
              style={{ marginLeft: "20px" }}
              width="30"
              height="30"
              src={`data:image/png;base64,${new Identicon(
                user.account,
                30
              ).toString()}`}
            />
          ) : (
            <span></span>
          )}
        </li>
      </ul>
    </nav>
  )
}

export default Nav
