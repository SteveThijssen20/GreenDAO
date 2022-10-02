import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import * as nearAPI from "near-api-js"
import UseFormInput from "../UseFormInput";

export default function BidNFTModal({
  show,
  onHide,
  tokenId,
  eventId,
  toAddress,
  type,
  Highestbid,
}) {
  //Variables
  const [Alert, setAlert] = useState("");
  const Web3 = require("web3");

  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  //Input fields
  const [Amount, AmountInput] = UseFormInput({
    type: "text",
    placeholder: "Amount",
  });

  function activateWorkingModal(TextAlert) {
    //Activating Working Text
    var alertELM = document.getElementById("workingalert");
    alertELM.style.display = "inherit";
    setAlert(TextAlert);
  }

  async function bidNFT() {
    //Bid NFT function

    var BidNFTBTN = document.getElementById("bidNFTBTN");
    BidNFTBTN.disabled = true;
    if (Number(Amount) < Number(Highestbid)) {
      // If given bid price is less than highest bid
      activateWorkingModal(`Amount cannot be under ${Highestbid} NEAR`);
      return;
    } else {
      var alertELM = document.getElementById("workingalert");
      alertELM.style.display = "none";
    }
    try {

      const tokenUri = await window.nearcontract.get_tokenuri_from_id({ token_id: Number(tokenId) });
      var parsed = await JSON.parse(tokenUri);
      if (
        Number(parsed["properties"]["price"]["description"]) < Number(Amount)
      ) {
        parsed["properties"]["price"]["description"] = Amount;
        parsed["properties"]["higherbidadd"]["description"] = walletConnection.getAccountId();
      }
      let currentDate = new Date();
      const createdObject = {
        title: "Asset Metadata Bids",
        type: "object",
        properties: {
          username: {
            type: "string",
            description: walletConnection.getAccountId(),
          },
          bid: {
            type: "string",
            description: Amount,
          },
          time: {
            type: "string",
            description: currentDate,
          },
        },
      };
      const totalraised = await window.nearcontract.get_event_raised({ event_id: Number(eventId) });
      let Raised = 0;
      Raised = Number(totalraised) + Number(Amount);
      //Calling smart contract method(functon) to store in to Smart Contract

      activateWorkingModal("Bidding...."); // Bidding on NEAR
      await window.nearcontract.bid_nft({ "_token_id": Number(tokenId), "_bid_uri": JSON.stringify(createdObject), "_updated_uri": JSON.stringify(parsed), "_highest_bidder": walletConnection.getAccountId(), "_eventid": Number(eventId), "_raised": Raised.toString() }, "60000000000000", nearAPI.utils.format.parseNearAmount(Amount).toString())

      BidNFTBTN.disabled = false;
      // window.location.reload();
    } catch (e) {
      console.error(e);
      var alertELM = document.getElementById("workingalert");
      alertELM.style.display = "none";
      BidNFTBTN.disabled = false;
      return;
    }
  }

  return (
    <Dialog
      isOpen={show}
      onDismiss={onHide}
      maxWidth="480px"
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
          Bid NFT
        </Header>
      }
    >
      <div className="p-6 flex flex-col gap-6">
        <Form className="flex flex-col gap-6">
          <div id="workingalert" style={{ display: "none", background: '#cce5ff' }} className="rounded flex flex-row items-center justify-center text-moon-24 p-3" role="alert">
            {Alert}
          </div>
          <Form.Group controlId="formGroupName">
            <div className="mb-3">Bid Amount in NEAR</div>
            {AmountInput}
          </Form.Group>
        </Form>
      </div>
      <Footer
        primButton={
          <Button variant="primary" id="bidNFTBTN" onClick={bidNFT}>
            Bid NFT
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
