import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import React, { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import { TextInput } from "@heathmont/moon-core-tw";
import { Select } from "@heathmont/moon-select";
import * as nearAPI from "near-api-js"
export default function SendAsGiftCardModal({
  show,
  onHide,
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
  const [RecipientAdd, setRecipientAdd] = useState("");
  const [NameUser, setNameUser] = useState("Write name");
  const [Message, setMessage] = useState("(Write your message)");
  const [FontType, setFontType] = useState("");

  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async function FecthNFTinfo() {
    const tokeninfo = await window.nearcontract.get_tokenuri_from_id({token_id:Number(TokenID)});
    var value = JSON.parse(tokeninfo);
    setTokenURI({
      name: value.properties.name.description,
      image: value.properties.image.description,
      price: value.properties.price.description,
      higherbidder: value.properties.higherbidadd.description,
    });
  }

  async function SendGiftCard() {
    //Send Gift Card function
    var sendGiftBTN = document.getElementById("sendGiftBTN");
    sendGiftBTN.disabled = true;

    try {
  
      await window.nearcontract.send_nft_as_gift({token_id:Number(TokenID), user:RecipientAdd.toString()}, "60000000000000")


    } catch (e) {
      console.error(e);
    }
    sendGiftBTN.disabled = false;
  }

  useEffect(() => { FecthNFTinfo(); }, [show]);
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
          Send NFT as gift card
        </Header>
      }
    >
      <div className="flex flex-col">
        <Form className="flex flex-col gap-6 p-6">
          <Form.Group>
            <div className="mb-2">Recipient wallet address</div>
            <TextInput
              placeholder="Add address"
              type="text"
              onChange={(e) => {
                setRecipientAdd(e.target.value);
              }}
              id="recipientBOX"
            />
          </Form.Group>
          <Form.Group>
            <div className="mb-2">Username</div>

            <TextInput
              placeholder="Tag your user name with @"
              type="text"
              onChange={(e) => {
                setNameUser(e.target.value);
              }}
              id="userBOX"
            />
          </Form.Group>
          <Form.Group>
            <div className="mb-2">Description</div>

            <textarea
              placeholder="Add text to your gift card"
              onChange={(e) => {
                setMessage(e.target.value);
              }}
              style={{ minHeight: 88 }}
              type="text"
              id="MessageBOX"
              className="block w-full max-w-full p-4 m-0 appearance-none text-[1rem] text-bulma transition-shadow box-border relative z-[2] shadow-input hover:shadow-input-hov focus:shadow-input-focus focus:outline-none bg-gohan h-10 rounded-moon-i-sm hover:rounded-moon-i-sm focus:rounded-moon-i-sm invalid:rounded-moon-i-sm before:box-border after:box-border placeholder:text-trunks placeholder:opacity-100 placeholder:transition-opacity placeholder:delay-75 read-only:outline-0 read-only:border-none read-only:cursor-not-allowed read-only:hover:shadow-input read-only:focus:shadow-input input-dt-shared invalid:shadow-input-err invalid:hover:shadow-input-err invalid:focus:shadow-input-err"
              rows="3"
            />
          </Form.Group>
          <Form.Group>
            <Select
              options={[
                {
                  value: "Arial",
                  label: "Arial",
                },
                {
                  value: "Calibri",
                  label: "Calibri",
                },
                {
                  value: "Tangerine, cursive",
                  label: "Tangerine, cursive",
                },
                {
                  value: "Times new roman",
                  label: "Times new roman",
                },
              ]}
              label="Font style"
              placeholderSlot="Choose font"
              onChange={(e) => setFontType(e.value)}
            />
          </Form.Group>
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
                    <div>To {RecipientAdd}</div>
                    <div>{Message}</div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div
                      className="rounded-xl overflow-hidden"
                      style={{ height: 168, width: 168 }}
                    >
                      <img
                        style={{ height: 168, width: 168, objectFit: "cover" }}
                        src={TokenURI.image}
                        alt=""
                      />
                    </div>
                    <div className="flex justify-center">{TokenURI.name}</div>
                  </div>
                </div>
                <div className="flex justify-center">{NameUser}</div>
              </div>
            </div>
          </div>
        </Form>
      </div>
      <Footer
        primButton={
          <Button variant="primary" id="sendGiftBTN" onClick={SendGiftCard}>
            Send your Gift Card
          </Button>
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
