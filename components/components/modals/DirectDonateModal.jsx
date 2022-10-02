import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import * as nearAPI from "near-api-js"
import UseFormInput from "../UseFormInput";

export default function DirectDonateModal({
  show,
  onHide,
  eventId,
  EventWallet,
  SelectedTitle,
}) {
  const [Alert, setAlert] = useState("");

  const Web3 = require("web3");

  const sleep = (milliseconds) => {
    //Custom sleep(n) code
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  const [Amount, AmountInput] = UseFormInput({
    //Input field
    type: "number",
    placeholder: "Amount",
  });

  function activateWorkingModal(TextAlert) {
    //Changing Success Alert box text
    var alertELM = document.getElementById("workingalert");
    alertELM.style.display = "inherit";
    setAlert(TextAlert);
  }

  async function DonateCoin() {
    //Donate button function
    activateWorkingModal("Donating....");
    var DonateBTN = document.getElementById("DonateBTN"); //clicked Donate Button
    DonateBTN.disabled = true;

    try {
      let convertedDefaultAmount = Number(Amount);
      let totalEarned = await window.nearcontract.get_event_raised({ event_id: Number(eventId) });
      
      const Raised =
        Number(totalEarned) +
        Number(convertedDefaultAmount);

      activateWorkingModal("Transferring....");

      await window.nearcontract.set_event_raised({_event_id:Number(eventId), raised:Raised.toString()}, "60000000000000", nearAPI.utils.format.parseNearAmount(Amount).toString())

  
    } catch (e) {
      //Got error
      console.error(e);
      var alertELM = document.getElementById("workingalert");
      alertELM.style.display = "none";
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
          Donate NEAR
        </Header>
      }
    >
      <div className="p-6 flex flex-col gap-6">
        <Form className="flex flex-col gap-6">
          <div id="workingalert" style={{ display: "none",background: '#cce5ff' }} className="rounded flex flex-row items-center justify-center text-moon-24 p-3" role="alert">
            {Alert}
          </div>

          <Form.Group controlId="formGroupName">
            <div className="mb-3">Amount</div>
            {AmountInput}
          </Form.Group>
        </Form>
      </div>
      <div className="d-grid"></div>
      <Footer
        primButton={
          <Button id="DonateBTN" onClick={DonateCoin}>
            Donate NEAR
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
