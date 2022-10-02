import React, { useState, useEffect } from "react";
import NavLink from "next/link";
import { Button } from "@heathmont/moon-core-tw";
import { SoftwareLogOut } from "@heathmont/moon-icons-tw";
import "../../../near-contracts/contract";

declare let window: any;

export function Nav(): JSX.Element {
  const [acc, setAcc] = useState("");
  const [Balance, setBalance] = useState("");

  const [isSigned, setSigned] = useState(false);
  async function fetchInfo() {
    if (window.ethereum == null) {
      window.document.getElementById("withoutSign").style.display = "none";
      window.document.getElementById("withSign").style.display = "none";
      window.document.getElementById("installMetaMask").style.display = "";
      return;
    }
    if (window.walletConnection.isSignedIn() == true) {
      let accoun = await window.near.account(
        window.walletConnection.getAccountId()
      );
      await setAcc(window.walletConnection.getAccountId());
      var Balance = await accoun.getAccountBalance();
      let price = await Number(Balance.total / 1000000000000000000000000);

      setBalance(price.toString() + " NEAR");
      if (!isSigned)
      setSigned(true);
      window.document.getElementById("withoutSign").style.display = "none";
      window.document.getElementById("withSign").style.display = "";
    } else {
      setSigned(false);
      window.document.getElementById("withoutSign").style.display = "";
      window.document.getElementById("withSign").style.display = "none";
    }
  }
  useEffect(() => {
     fetchInfo();
  }, [isSigned]);
 

  async function onClickDisConnect() {
    await window.walletConnection.signOut();
    window.localStorage.setItem("Type", "");
    window.location.href = "/";
  }

  return (
    <nav className="main-nav w-full flex justify-between items-center">
      <ul className="flex justify-between items-center w-full">
        {isSigned?(   <>
          
          <li>
            <NavLink href="/daos" id="gransbtnNav">
              <a>
                <Button style={{ background: "none" }}> DAO</Button>
              </a>
            </NavLink>
          </li>
          <li>
            <NavLink href="/CreateDao">
              <a>
                <Button style={{ background: "none" }}>Create DAO</Button>
              </a>
            </NavLink>
          </li>
        </>):(<></>)}

        <li className="Nav walletstatus flex flex-1 justify-end">
          <div className="py-2 px-4 flex row items-center" id="withoutSign">
            <NavLink href="/login?[/]">
              <a>
                <Button variant="tertiary">Log in</Button>
              </a>
            </NavLink>
          </div>
          <div
            id="installMetaMask"
            style={{ display: "none" }}
            className="wallets"
          ></div>

          <div id="withSign" className="wallets" style={{ display: "none" }}>
            <div
              className="wallet"
              style={{ height: 48, display: "flex", alignItems: "center" }}
            >
              <div className="wallet__wrapper gap-4 flex items-center">
                <div className="wallet__info flex flex-col items-end">
                  <a href={`/user/${acc}`} className="text-primary">
                    <div className="font-light text-goten">{acc}</div>
                  </a>
                  <div className="text-goten">{Balance}</div>
                </div>
                <Button iconOnly onClick={onClickDisConnect}>
                  <SoftwareLogOut
                    className="text-moon-24"
                    transform="rotate(180)"
                  ></SoftwareLogOut>
                </Button>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </nav>
  );
}
