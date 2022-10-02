import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import React, { useState } from "react";

export default function UnwrapGiftCardModal({
  show,
  onHide,
  contract,
  TokenID,
  EventID,
}) {
  //Variables
  const [TokenURI, setTokenURI] = useState({
    name: "",
    image: "",
    price: "",
    higherbidder: "",
  });
  const [GiftURI, setGiftURI] = useState({
    Message: "",
    FontType: "",
    NameUser: "",
    Wallet: "",
  });
  const [RecipientAdd, setRecipientAdd] = useState("");
  const [NameUser, setNameUser] = useState("Write your name");
  const [Message, setMessage] = useState("(Write your message)");
  const [FontType, setFontType] = useState("");
  const Web3 = require("web3");

  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async function FecthNFTinfo() {
    const tokeninfo = await contract.tokenURI(Number(TokenID));
    var value = JSON.parse(tokeninfo);
    setTokenURI({
      name: value.properties.name.description,
      image: value.properties.image.description,
      price: value.properties.price.description,
      higherbidder: value.properties.higherbidadd.description,
    });

    const giftinfo = await contract.GetGiftURIFromToken(TokenID.toString());
    var value = JSON.parse(giftinfo);
    setGiftURI({
      Message: value.Message,
      FontType: value.FontType,
      NameUser: value.NameUser,
      Wallet: value.Wallet,
    });
  }

  async function UnwrapGiftCard() {
    //Unwrap Gift Card function
    var unwrapGiftBTN = document.getElementById("unwrapGiftBTN");
    unwrapGiftBTN.disabled = true;

    try {
      const web3 = new Web3(window.ethereum);
      const account = await web3.eth.getAccounts();

      await contract.UnWrapGift(TokenID.toString());

      window.document.getElementsByClassName("btn-close")[0].click();
      unwrapGiftBTN.disabled = false;
      await sleep(5000);
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
    unwrapGiftBTN.disabled = false;
  }

  return (
    <Dialog
      isOpen={show}
      onDismiss={onHide}
      maxWidth="760px"
      position="TOP"
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
          Unwrap gift card
        </Header>
      }
    >
      <div className="d-flex flex-column gap-3 modal-body p-6">
        <div className="d-flex justify-content-center">
          <div className="flex justify-center ">
            <div
              className="rounded-xl p-6 text-"
              style={{
                height: 300,
                width: 480,
                background:
                  "linear-gradient(294.31deg, #FFB6C8 -195.84%, #8A9AFF 114.04%)",
                boxShadow:
                  "0px 6px 6px -6px rgba(0, 0, 0, 0.16), 0px 0px 1px rgba(0, 0, 0, 0.4)",
              }}
            >
              <div className="flex flex-col justify-center gap-6 text-gohan">
                <div className="flex gap-8">
                  <div className="flex flex-col gap-4 flex-1">
                    <div>To {NameUser}</div>
                    <div>{Message}</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ height: 168, width: 168 }}
                    >
                      <img
                        style={{ height: 168, width: 168, objectFit: "cover" }}
                        src="https://www.criptofacil.com/wp-content/uploads/2021/07/o-que-e-nft-veja-aqui-o-que-voce-precisa-saber.jpg"
                        alt=""
                      />
                    </div>
                    <div className="flex justify-center">NFT Name</div>
                  </div>
                </div>
                <div className="flex justify-center">{RecipientAdd}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer
        primButton={
          <Button id="unwrapGiftBTN" onClick={UnwrapGiftCard}>
            Unwrap Gift Card
          </Button>
        }
        isDivider
      />
    </Dialog>
  );
}
