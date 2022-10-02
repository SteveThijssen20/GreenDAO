import { Dialog } from "@heathmont/moon-components";
import { Header, Footer } from "@heathmont/moon-core";
import { Button } from "@heathmont/moon-core-tw";
import { ControlsClose } from "@heathmont/moon-icons";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function ViewmodalShow({ show, onHide, id, title }) {
  const [list, setList] = useState([]);

  function addZero(num) {
    return num < 10 ? `0${num}` : num; //Adding zero before number
  }
  function AmPM(num) {
    return num < 12 ? "AM" : "PM"; //Returning AM or PM
  }
  const formatter = new Intl.NumberFormat("en-US", {
    //converting number to comma version
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  async function fetchContractData() {
    //Returning all the Informaiton after page load
    try {
      if (window.nearcontract && id ) {
        setList([]);
        const arr = [];
        const totalBids = JSON.parse(await window.nearcontract.get_bid_info_from_nft({token_id: Number(id)})); //Getting total bids of this NFT id
        for (let i = 0; i < Object.keys(totalBids).length; i++) {
          //Counting 1 - 10
          const obj = await totalBids[i]; //no.i bid information is in JSON format
          let object = {};
          try {
            object = await JSON.parse(obj);
          } catch {} //Converting JSON format to object type
          if (object.title) {         
          
             const Datetime = new Date(object.properties.time.description);
            let currentdate = `${addZero(Datetime.getDate())}/${addZero(
              Datetime.getMonth() + 1
            )}/${addZero(Datetime.getFullYear())} ${addZero(
              Datetime.getHours()
            )}:${addZero(Datetime.getMinutes())}:${addZero(
              Datetime.getSeconds()
            )} ${AmPM(Datetime.getHours())}`;
            arr.push({
              //pushing all information in array
              Id: i,
              name: object.properties.username.description,
              time: currentdate,
              bidprice: object.properties.bid.description,
            });
          }
        }

        setList(arr); //Setting this array into list

        if (document.getElementById("Loading"))
          document.getElementById("Loading").style = "display:none";
        if (document.getElementById("Loadingtable")) {
          var element = document.getElementById("Loadingtable");
          element.style = "display:flex";
          element.setAttribute("id", "");
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(()=>{fetchContractData();},[show]);
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
          View Bid - {title}
        </Header>
      }
    >
      <div className="flex p-6">
        <div
          id="Loadingtable"
          className="rounded-lg bg-goku p-1 overflow-hidden flex flex-col w-full"
        >
          <div className="flex">
            <div className="flex-1 flex items-center p-3">
              <h6 className="header">Date</h6>
            </div>
            <div className="flex-1 flex items-center p-3">
              <h6 className="header">Wallet address</h6>
            </div>
           
            <div className="flex-1 flex items-center p-3">
              <h6 className="header">Bid amount</h6>
            </div>
          </div>{" "}
          {list.map((listItem) => (
            <div key={listItem.Id} className="flex bg-gohan">
              <div className="flex-1 flex items-center p-3">
                <h6 className="cell">{listItem.time}</h6>
              </div>
              <div className="flex-1 flex items-center p-3">
                <a
                  className="viewbid walletaddress text-piccolo"
                  href={`/user/` + listItem.name}
                >
                  {listItem.name}
                </a>
              </div>
             
              <div className="flex-1 flex items-center p-3">
                <h6 className="cell">{listItem.bidprice} NEAR</h6>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer
        primButton={
          <Button variant="primary" onClick={onHide}>
            Close
          </Button>
        }
        isDivider
      />
    </Dialog>
  );
}
