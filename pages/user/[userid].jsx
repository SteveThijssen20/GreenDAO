import React, { useState, useEffect } from "react";
import Head from "next/head";
import { Header } from "../../components/layout/Header";
import isServer from "../../components/isServer";
// Assets and Tokens
import "isomorphic-fetch";
import { Button } from "@heathmont/moon-core-tw";

//Assets and Token Component
import styles from "./User.module.css";
import NFTComponent from "./components/NFTComponent";
import * as nearAPI from "near-api-js"
//Gift Card
import SendAsGiftCardModal from "../../components/components/modals/SendAsGiftCardModal";
import UnwrapGiftCardModal from "../../components/components/modals/UnwrapGiftCardModal";
import { GenericUser } from "@heathmont/moon-icons-tw";

let PROFILE_ADDRESS = "";

export default function User() {
  //Variables

  //Gift Card Modal
  const [ShowGiftModal, setShowGiftModal] = useState(false);
  const [ShowUnwrapGiftModal, setShowUnwrapGiftModal] = useState(false);
  const [SelectedEventID, setSelectedEventID] = useState(false);
  const [SelectedTokenID, setSelectedTokenID] = useState(false);

  const [NFTs, setNFTs] = useState([]);

  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };

  useEffect(() => {
    PROFILE_ADDRESS = window.location.pathname.replace("/user/", "");
    fetchData();
  });

  if (isServer()) return null;
  async function fetchData() {
    console.clear();
    if (window.nearcontract) {
      if (PROFILE_ADDRESS === "") {
        return;
      }

      let arr = [];
      const allWonNFTs = JSON.parse(await window.nearcontract.get_all_nfts_from_userid({user:PROFILE_ADDRESS.toString()})) //Getting event URI from smart contract       
    
      for (let index = 0; index < Object.keys(allWonNFTs).length; index++) {
        const TokenId = Number(allWonNFTs[index]); 
        const object = JSON.parse(await window.nearcontract.get_tokenuri_from_id({token_id:TokenId})) 
       
        const EventID = await window.nearcontract.get_eventid_from_tokenuri({token_uri:JSON.stringify(object)});
        arr.push({
          Id: TokenId,
          name: object.properties.name.description,
          description: object.properties.description.description,
          price: Number(object.properties.price.description),
          image: object.properties.image.description,
          EventID: EventID,
          isGift: false,
        });
      }
      setNFTs(arr);

      document.getElementById("Loading").style = "display:none";
    }
  }

  function ProfileImage() {
    return (
      <>
        <div
          className="flex justify-center items-center"
          style={{
            border: "1px solid #EBEBEB",
            borderRadius: "50%",
            height: 64,
            width: 64,
          }}
        >
          {" "}
          <GenericUser className="text-moon-32" />
        </div>
      </>
    );
  }

  function activateGiftCardModal(TokenID, EventID) {
    setSelectedTokenID(TokenID);
    setSelectedEventID(EventID);
    setShowGiftModal(true);
  }

  function activateUnwrapGiftCardModal(TokenID, EventID) {
    setSelectedTokenID(TokenID);
    setSelectedEventID(EventID);
    setShowUnwrapGiftModal(true);
  }

  return (
    <>
      <Header></Header>
      <Head>
        <title>User</title>
        <meta name="description" content="Donation" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="row user UserContainer">
        <div className="user imagecontainer">
          <div className="TextContainer">
            <h4>Address: </h4>
            <h5 style={{ paddingTop: "0.4rem" }}>{PROFILE_ADDRESS} </h5>
          </div>
        </div>
      </div>

      <div id="Loading" className="user LoadingArea">
        <h1>Loading...</h1>
      </div>
      <div className={`${styles.container} flex items-center flex-col gap-8`}>
        <div className={`${styles.title} flex gap-8`}>
          <ProfileImage />

          <div className={`gap-4 flex flex-col`}>
            <h1 className="text-moon-32 font-bold">
            {PROFILE_ADDRESS}
              {/* {ProfileDetails?.name ? ProfileDetails?.name : "Unknown"}{" "} */}
            </h1>
            <p className="text-trunks">
              <span className="font-bold">Donor </span>
          
            </p>
           
          </div>
        </div>

        <div className={styles.divider}></div>

        <h1 className={`${styles.title} text-moon-24 font-bold`}>
          Collectibles ({NFTs.length})
        </h1>

        <div className="flex gap-8">
          {NFTs.length === 0 ? (
            <>
              <h6>No items</h6>
            </>
          ) : (
            <>
              {NFTs.map((listItem) => (
                <NFTComponent
                  key={listItem.Id}
                  TokenID={listItem.Id}
                  EventID={listItem.EventID}
                  name={listItem.name}
                  description ={listItem.description}
                  price={listItem.price}
                  isGifted={listItem.isGift}
                  image={listItem.image}
                  signer={window.walletConnection.getAccountId()}
                  wallet={PROFILE_ADDRESS}
                  showingFunc={()=>{activateGiftCardModal(listItem.Id,listItem.EventID)}}
                  unwrapingFunc={()=>{activateUnwrapGiftCardModal(listItem.Id,listItem.EventID)}}
                />
              ))}
            </>
          )}
        </div>
      </div>

      <SendAsGiftCardModal
        show={ShowGiftModal}
        onHide={() => {
          setShowGiftModal(false);
        }}
        TokenID={SelectedTokenID}
        EventID={SelectedEventID}
      />     
    </>
  );
}
