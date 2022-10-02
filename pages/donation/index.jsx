import React, { useState, useEffect } from "react";
import Head from "next/head";
import Image from "next/image";
import NavLink from "next/link";

import DonateNFTModal from "../../components/components/modals/DonateNFTModal";
import { Header } from "../../components/layout/Header";
import isServer from "../..//components/isServer";
import styles from "./Auctions.module.css";
import Card from "../../components/components/Card/Card";
import { ControlsChevronRight } from "@heathmont/moon-icons-tw";
import { Button } from "@heathmont/moon-core-tw";

export default function Donation() {
  //Variables
  const [CreatemodalShow, setModalShow] = useState(false);
  const [list, setList] = useState([]);
  const [selectid, setselectid] = useState("");
  const [selectedtype, setselectedtype] = useState("");
  const [SelectedTitle, setSelectedTitle] = useState("");
  const [SelectedendDate, setSelectedendDate] = useState("");
  const [SelectedWallet, setSelectedWallet] = useState("");
  const [AccountAddress, setAccountAddress] = useState("");
  useEffect(() => {
    fetchContractData();
  });
  setInterval(function () {
    calculateTimeLeft();
  }, 1000);

  if (isServer()) return null;

  function calculateTimeLeft() {
    //Calculate time left
    try {
      var allDates = document.getElementsByName("DateCount");
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute("date");
        var status = allDates[i].getAttribute("status");
        allDates[i].innerHTML = LeftDate(date, status);
      }
    } catch (error) {}
  }

  const formatter = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  async function fetchContractData() {
    //Fetching data from Smart contract
    try {
      if (window.nearcontract) {
        setAccountAddress(window.accountId);
        const totalEvent =JSON.parse(await window.nearcontract.get_all_events()); //Getting total event (Number)
        const arr = [];

        for (let i = 0; i < Object.keys(totalEvent).length; i++) {
          //total event number Iteration
          const object = JSON.parse(totalEvent[i][1]);
          const statusvalue = object[2]; //Get Event Status if it is finished or waiting for NFT release

          if (object) {
            //Checking if the event date is expired or not
            var c = new Date(object.properties.Date.description).getTime();
            var n = new Date().getTime();
            var d = c - n;
            var s = Math.floor((d % (1000 * 60)) / 1000);
            if (
              s.toString().includes("-") &&
              object.properties.wallet.description !==
                window.walletConnection.getAccountId()
            ) {
              continue;
            }

            arr.push({
              //Pushing all data into array

              eventId: i,
              Title: object.properties.Title.description,
              Date: object.properties.Date.description,
              Goal: object.properties.Goal.description,
              logo: object.properties.logo.description.url,
              wallet: object.properties.wallet.description,
              status: statusvalue,
            });
          }
        }
        setList(arr);
        /** TODO: Fix fetch to get completed ones as well */
        document.getElementById("Loading").style = "display:none";
      }
    } catch (error) {
      console.error(error);
    }
  }
  

  function LeftDate(datetext, status) {
    //Counting Left date in date format
    var c = new Date(datetext).getTime();
    var n = new Date().getTime();
    var d = c - n;
    var da = Math.floor(d / (1000 * 60 * 60 * 24));
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((d % (1000 * 60)) / 1000);
    if (s.toString().includes("-") && status === "Finished") {
      return "Auction Ended";
    } else if (s.toString().includes("-") && status !== "Finished") {
      return "Waiting for NFTs release";
    }
    return (
      da.toString() +
      " Days " +
      h.toString() +
      " hours " +
      m.toString() +
      " minutes " +
      s.toString() +
      " seconds"
    );
  }

  return (
    <>
      <Header></Header>
      <Head>
        <title>Auctions</title>
        <meta name="description" content="Auctions" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={`${styles.container} flex items-center flex-col gap-8`}>
        <div className={`${styles.title} gap-8 flex flex-col`}>
          <h1 className="text-moon-32 font-bold">All auctions</h1>

          <div className={`${styles.tabs} flex gap-4`}>
            <NavLink href="?q=All">
              <a className="DonationBarLink tab block px-3 py-2 active">All</a>
            </NavLink>
            <NavLink href="?q=Today">
              <a className="DonationBarLink tab block px-3 py-2">Today</a>
            </NavLink>
            <NavLink href="?q=This Month">
              <a className="DonationBarLink tab block px-3 py-2">This Month</a>
            </NavLink>
          </div>
        </div>

        <div className={styles.divider}></div>

        <div id="Loading" className="LoadingArea">
          <h1>Loading...</h1>
        </div>

        <div className="flex flex-col gap-8">
          {list.map((listItem, index) => (
            <Card height={300} width={640} key={index} className="p-10">
              <div className="flex flex-col gap-8 w-full">
                <div className="flex gap-6 w-full">
                  <span className={styles.image}>
                    <img alt="" src={listItem.logo} />
                  </span>
                  <div className="flex flex-col gap-2 overflow-hidden text-left">
                    <div className="font-bold">{listItem.Title}</div>
                    <div>Raised out of {listItem.Goal} NEAR</div>
                    <div className="whitespace-nowrap truncate">
                      Organised by&nbsp;
                      {listItem.wallet !=
                      window.walletConnection.getAccountId() ? (
                        listItem.wallet
                      ) : (
                        <>(Me)</>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex justify-between align-center">
                  <div className="flex items-center font-bold">
                    {LeftDate(listItem.Date, listItem.status)} left
                  </div>
                  <NavLink href={`/donation/auction?[${listItem.eventId}]`}>
                    <Button iconleft>
                      <ControlsChevronRight />
                      Go to auction
                    </Button>
                  </NavLink>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <DonateNFTModal //Donate NFT Modal code
        show={CreatemodalShow}
        onHide={() => {
          setModalShow(false);
        }}
        EventID={selectid}
        type={selectedtype}
        SelectedTitle={SelectedTitle}
        enddate={SelectedendDate}
        EventWallet={SelectedWallet}
      />
    </>
  );
}
