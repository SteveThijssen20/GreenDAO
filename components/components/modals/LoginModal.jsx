import { useState } from "react";

import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import { GenericCheckRounded, GenericClose } from "@heathmont/moon-icons-tw";
import Link from "next/link";
import { Dialog } from "@heathmont/moon-components";

export default function Login({ show, onHide, redirecting }) {
  const [ConnectStatus, setConnectStatus] = useState(true);
  //NEAR
  function NearWallet() {
    if (window.walletConnection?.isSignedIn() == false) {
      return (
        <>
          <div className="flex gap-6 items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://i.postimg.cc/nzQMgnnJ/Near.png" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">NEAR wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#FF4E64" }}
              >
                <GenericClose
                  className="text-moon-32"
                  color="#FF4E64"
                ></GenericClose>
                Disconnected
              </span>
            </div>
            <Button onClick={onClickConnectNear} style={{ width: 112 }}>
              Connect
            </Button>
          </div>
        </>
      );
    }
    if (window.walletConnection?.isSignedIn() == true) {
      return (
        <>
          <div className="flex gap-6 items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://i.postimg.cc/nzQMgnnJ/Near.png" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">NEAR wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#40A69F" }}
              >
                <GenericCheckRounded
                  className="text-moon-32"
                  color="#40A69F"
                ></GenericCheckRounded>
                Connected
              </span>
            </div>
            <Button
              onClick={onClickDisConnectNEAR}
              variant="secondary"
              style={{ width: 112 }}
            >
              Disconnect
            </Button>
          </div>
        </>
      );
    }
  }
  async function onClickConnectNear() {
    window.walletConnection.requestSignIn(
      window.nearConfig.contractName,
      "GreenDAO"
    );
  }
  async function onClickConnectedNEAR() {
    window.location.href = redirecting;
  }

  async function onClickDisConnectNEAR() {
    await window.walletConnection.signOut();
    window.location.href = window.location.href;
  }

  //Aurora
  function AuroraWallet() {
    if (window.ethereum == null) {
      return (
        <>
          <div className="flex gap-6 items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://i.postimg.cc/3wCZzRCV/Aurora.jpg" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">Aurora (Metamask) wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#FF4E64" }}
              >
                <GenericClose
                  className="text-moon-32"
                  color="#FF4E64"
                ></GenericClose>
                Not installed
              </span>
            </div>
            <Link
              href="https://chrome.google.com/webstore/detail/nkbihfbeogaeaoehlefnkodbefgpgknn"
              target={"_blank"}
            >
              <a>
                <Button style={{ width: 112 }}>Install</Button>
              </a>
            </Link>
          </div>
        </>
      );
    }

    return (
      <>
        {window.ethereum.selectedAddress == null ? (
          <div className="flex gap-6 items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://i.postimg.cc/3wCZzRCV/Aurora.jpg" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">Aurora (Metamask) wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#FF4E64" }}
              >
                <GenericClose
                  className="text-moon-32"
                  color="#FF4E64"
                ></GenericClose>
                Disconnected
              </span>
            </div>
            <Button onClick={onClickConnectAurora} style={{ width: 112 }}>
              Connect
            </Button>
          </div>
        ) : (
          <div className="flex gap-6 items-center">
            <div
              style={{ height: 80, width: 80, border: "1px solid #EBEBEB" }}
              className="p-4 rounded-xl"
            >
              <img src="https://i.postimg.cc/3wCZzRCV/Aurora.jpg" />
            </div>
            <div className="flex flex-1 flex-col">
              <span className="font-bold">Aurora (Metamask) wallet</span>
              <span
                className="flex items-center gap-1"
                style={{ color: "#40A69F" }}
              >
                <GenericCheckRounded
                  className="text-moon-32"
                  color="#40A69F"
                ></GenericCheckRounded>
                Connected
              </span>
            </div>
            <Button
              onClick={onClickDisConnectAurora}
              variant="secondary"
              style={{ width: 112 }}
            >
              Disconnect
            </Button>
          </div>
        )}
      </>
    );
  }
  async function onClickConnectAurora() {
    let result = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    result;
    try {
      const getacc = await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x4E454153" }],
      });
      getacc;
    } catch (switchError) {
      try {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x4E454153",
              chainName: "Aurora Testnet",
              nativeCurrency: {
                name: "ETH",
                symbol: "ETH",
                decimals: 18,
              },
              rpcUrls: ["https://testnet.aurora.dev"],
            },
          ],
        });
      } catch (addError) {
        // handle "add" error
        console.log(addError);
      }
    }
  }
  async function onClickConnectedAurora() {}
  async function onClickContinue() {
    window.location.href = redirecting;
  }
  async function onClickDisConnectAurora() {
    window.localStorage.setItem("ConnectedMetaMask", "");
    window.localStorage.setItem("Type", "");
    window.location.href = "/";
  }

  const fetchData = async () => {
    if (
      window.walletConnection?.isSignedIn() == true &&
      window.ethereum.selectedAddress != null
    ) {
      setConnectStatus(true);
    } else {
      setConnectStatus(false);
    }
  };

  setTimeout(() => {
    fetchData();
  }, 100);
  return (
    <Dialog
      isOpen={show}
      onDismiss={onHide}
      maxWidth="600px"
      position="CENTER"
      hideCloseButton
      variant="new"
      heading={
        <Header
          closeButton={
            <ControlsClose
              className="text-moon-24 text-trunks"
              onClick={onHide}
            />
          }
          isDivider={true}
        >
          Login
        </Header>
      }
    >
      <div className="p-4 flex flex-col gap-6">
        <p>Please connect both your wallets</p>
        <div style={{ height: 1 }} className="bg-beerus"></div>
        <NearWallet />
        <div style={{ height: 1 }} className="bg-beerus"></div>
        <AuroraWallet />
      </div>
      <Footer
        primButton={
          ConnectStatus ? (
            <>
              <Button onClick={onClickContinue} style={{ width: "150px" }}>
                Continue
              </Button>
            </>
          ) : (
            <>
              <Button disabled style={{ width: "150px" }}>
                Continue
              </Button>
            </>
          )
        }
        tertButton={
          <Button variant="ghost" onClick={onHide}>
            Cancel
          </Button>
        }
        isDivider
      />
    </Dialog>
  );
}
