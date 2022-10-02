import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import Image from "next/image";
import Form from "react-bootstrap/Form";
import styles from "./Modal.module.css";
import Web3 from "web3";
import UseFormInput from "../UseFormInput";
import UseFormTextArea from "../UseFormTextArea";
import { GenericPicture } from "@heathmont/moon-icons-tw";

export default function DonateNFTModal({
  show,
  onHide,
  type,
  EventID,
  SelectedTitle,
  enddate,
  EventWallet,
}) {
  //Input fields
  const [name, nameInput] = UseFormInput({
    type: "text",
    placeholder: "Enter name",
  });
  const [description, descriptionInput] = UseFormTextArea({
    as: "textarea",
    placeholder: "Enter description",
  });
  const [url, urlInput] = UseFormInput({
    type: "text",
    placeholder: "Add link",
  });

  const [price, priceInput] = UseFormInput({
    type: "text",
    placeholder: "Enter Price",
  });
  const sleep = (milliseconds) => {
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  async function createNFT() {
    //donate button click function
    let Logourl = url;

    //Creating an Object of all informations
    const createdObject = {
      title: "Asset Metadata",
      type: "object",
      properties: {
        eventID: EventID,
        name: {
          type: "string",
          description: name,
        },
        description: {
          type: "string",
          description: description,
        },
        image: {
          type: "string",
          description: Logourl,
        },
        price: {
          type: "string",
          description: price,
        },
        typeimg: {
          type: "string",
          description: type,
        },

        higherbidadd: {
          type: "string",
          description: EventWallet,
        },
        date: {
          type: "string",
          description: enddate,
        },
        wallet: {
          type: "string",
          description: EventWallet,
        },
      },
      bids: [],
    };

    //Calling smart contract method(functon) to store in to Smart Contract
    await window.nearcontract.mint_nft({"nft_metadata":JSON.stringify(createdObject),"event_id":Number(EventID)}, "60000000000000")
      
  }

  return (
    <Dialog
      isOpen={show}
      onDismiss={onHide}
      maxWidth="760px"
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
          Donate {type} - {SelectedTitle}
        </Header>
      }
    >
      <div className="p-6 flex flex-col gap-6">
        <Form className="flex flex-col gap-6">
          <Form.Group controlId="formGroupImageUrl">
            <div className="mb-2">NFT URL</div>
            {urlInput}
            {url ? (
              <div
                className="flex justify-center bg-goku"
                style={{
                  height: 216,
                  border: "1px solid #EBEBEB",
                  borderTop: 0,
                  objectFit: "contain",
                }}
              >
                <img src={url} />
              </div>
            ) : (
              <div
                className="bg-goku rounded-b-lg flex items-center justify-center"
                style={{
                  height: 216,
                  border: "1px solid #EBEBEB",
                  borderTop: 0,
                }}
              >
                <GenericPicture color="#999CA0" className="text-moon-64" />
              </div>
            )}
          </Form.Group>
          <div className={styles.divider}></div>
          <Form.Group controlId="formGroupName">
            <div className="mb-2">Name</div>
            {nameInput}
          </Form.Group>
          <Form.Group controlId="formGroupDescription">
            <div className="mb-2">Description</div>
            {descriptionInput}
          </Form.Group>
          <Form.Group controlId="formGroupName">
            <div className="mb-2">Opening price in NEAR</div>
            {priceInput}
          </Form.Group>
        </Form>
      </div>
      <Footer
        primButton={
          <Button variant="primary" type="button" onClick={createNFT}>
            Donate {type}
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
