import { Button } from "@heathmont/moon-core-tw";
import { ControlsPlus, TimeClock } from "@heathmont/moon-icons-tw";
import Head from "next/head";
import { useEffect, useState } from "react";
import BidNFTModal from "../../../components/components/modals/BidNFTModal";
import ViewBidNFTModal from "../../../components/components/modals/ViewBidNFTModal";
import DirectDonateModal from "..//..//..//components/components/modals/DirectDonateModal";
import DonateNFTModal from "..//..//..//components/components/modals/DonateNFTModal";
import SlideShow from "..//..//..//components/components/Slideshow";
import { GenericLoyalty } from "@heathmont/moon-icons-tw";

import Card from "../../../components/components/Card/Card";
import isServer from "../../../components/isServer";
import { Header } from "../../../components/layout/Header";
import styles from "../Auctions.module.css";
let EventEnd = "";
let EventWaiting = false;

export default function AuctionNFT() {
  //variables
  const [eventId, setEventId] = useState(-1);
  const [list, setList] = useState([]);
  const [imageList, setimageList] = useState([]);
  const [title, setTitle] = useState("");
  const [goal, setgoal] = useState("");
  const [EventEarned, setEventEarned] = useState("");
  const [EventDescription, setEventDescription] = useState("");
  const [EventWallet, setEventWallet] = useState("");
  const [AccountAddress, setAccountAddress] = useState("");
  const [SelectedendDate, setSelectedendDate] = useState("");
  const [date, setdate] = useState("");
  const [dateleftBid, setdateleftBid] = useState("");
  const [selectid, setselectid] = useState("");
  const [selecttitle, setselecttitle] = useState("");
  const [selectedAddress, setselectedAddress] = useState("");
  const [selecttype, setselecttype] = useState("");
  const [selectbid, setselectbid] = useState("");
  const [selectTab, setselectTab] = useState("overview");

  const [modalShow, setModalShow] = useState(false);
  const [ViewmodalShow, setViewModalShow] = useState(false);
  const [DonatemodalShow, setDonateModalShow] = useState(false);
  const [DirectModalShow, setDirectModalShow] = useState(false);

  const formatter = new Intl.NumberFormat("en-US", {
    //Converting number into comma version

    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const sleep = (milliseconds) => {
    //Custom Sleep function to wait
    return new Promise((resolve) => setTimeout(resolve, milliseconds));
  };
  let m;
  let id = ""; //Event id from url
  function LeftDate(datetext) {
    //String date to dd/hh/mm/ss format

    var c = new Date(datetext).getTime();
    var n = new Date().getTime();
    var d = c - n;
    var da = Math.floor(d / (1000 * 60 * 60 * 24));
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((d % (1000 * 60)) / 1000);
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
  function LeftDateBid(datetext) {
    //String date to d/h/m/s format

    var c = new Date(datetext).getTime();
    var n = new Date().getTime();
    var d = c - n;
    var da = Math.floor(d / (1000 * 60 * 60 * 24));
    var h = Math.floor((d % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var m = Math.floor((d % (1000 * 60 * 60)) / (1000 * 60));
    var s = Math.floor((d % (1000 * 60)) / 1000);
    if (EventEnd === "Finished" && s.toString().includes("-")) {
      return "Auction Ended";
    } else if (
      s.toString().includes("-") &&
      EventWaiting === true &&
      EventEnd !== "Finished"
    ) {
      return "Waiting for release";
    } else {
      return (
        da.toString() +
        "d " +
        h.toString() +
        "h " +
        m.toString() +
        "m " +
        s.toString() +
        "s" + " left"
      );
    }
  }

  useEffect(() => {
    if (!isServer()) {
      fetchContractData();
    }
  }, [id]);
  if (isServer()) return null;
  const regex = /\[(.*)\]/g;
  const str = decodeURIComponent(window.location.search);

  while ((m = regex.exec(str)) !== null) {
    // This is necessary to avoid infinite loops with zero-width matches

    if (m.index === regex.lastIndex) {
      regex.lastIndex++;
    }
    id = m[1];
  }

  async function fetchContractData() {
    try {
      if (window.nearcontract && id) {
        setAccountAddress(window.accountId);
        setEventId(id); //setting Event id
        id = Number(id);
        const valueAll = JSON.parse(await window.nearcontract.event_uri({ event_id: id })) //Getting event URI from smart contract

        const value = valueAll[1];

        const arr = [];
        const totalTokens = JSON.parse(await window.nearcontract.get_token_search_from_event({ event_id: id })); //Getting total NFTs of that event
        let totalEarned = await window.nearcontract.get_event_raised({ event_id: id });
        for (let i = 0; i < totalTokens.length; i++) {
          //Getting all NFTs
          const obj = await totalTokens[i];

          let object = {};
          try {
            object = await JSON.parse(obj);
          } catch { }
          if (object.title) {
            var pricedes1 = 0;
            try {
              pricedes1 = formatter.format(
                Number(object.properties.price.description * 5.51)
              ); //Bid price in comma version
            } catch (ex) { }
            const TokenId = Number(await window.nearcontract.get_tokenid_from_uri({ token_uri: obj })); //Getting NFT id from NFT URI

            arr.push({
              Id: TokenId,
              name: object.properties.name.description,
              description: object.properties.description.description,
              Bidprice: pricedes1,
              highestbidder: object.properties.higherbidadd.description,
              price: Number(object.properties.price.description),
              type: object.properties.typeimg.description,
              image: object.properties.image.description,
            });
          }
        }
        console.log(valueAll);
        EventEnd = valueAll[2];
        //Setting these data into variables
        setList(arr);
        if (document.getElementById("Loading"))
          document.getElementById("Loading").style = "display:none";

        const object = JSON.parse(value);
        setimageList(object.properties.allFiles);
        setTitle(object.properties.Title.description);
        setselectedAddress(object.properties.wallet.description);
        setgoal(Number(object.properties.Goal.description));
        setEventEarned(formatter.format(Number(totalEarned)));
        setEventDescription(object.properties.Description.description);
        setEventWallet(object.properties.wallet.description);
        setSelectedendDate(object.properties.Date.description);
        setdate(object.properties.Date.description);
        setdateleftBid(LeftDateBid(object.properties.Date.description));

        console.log(object.properties.wallet.description);
        //Checking if the event manager has to distribute NFT or not
        var c = new Date(object.properties.Date.description).getTime();
        var n = new Date().getTime();
        var d = c - n;
        var s = Math.floor((d % (1000 * 60)) / 1000);

        if (
          s.toString().includes("-") &&
          object.properties.wallet.description ===
          window.walletConnection.getAccountId() &&
          valueAll[2] !== "Finished"
        ) {
          console.log("should be");
          EventWaiting = true;
        }
      }
    } catch (error) {
      console.error(error);
    }
  }

  setInterval(function () {
    calculateTimeLeft();
  }, 1000);

  function calculateTimeLeft() {
    //Calculating time left
    try {
      var allDates = document.getElementsByName("dateleft");
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute("date");
        allDates[i].innerHTML = LeftDate(date);
      }
      var allDates = document.getElementsByName("date");
      for (let i = 0; i < allDates.length; i++) {
        var date = allDates[i].getAttribute("date");
        if (date !== undefined && date !== "") {
          allDates[i].innerHTML = LeftDateBid(date);
        }
      }
    } catch (error) { }
  }

  function activateViewBidModal(e) {
    //Activating view bid Modal
    setselectid(e.target.getAttribute("tokenid"));
    setselecttitle(e.target.getAttribute("title"));

    setViewModalShow(true);
  }

  function activateBidNFTModal(e) {
    //Activating Bid NFT Modal
    setselectid(e.target.getAttribute("tokenid"));
    setselectbid(e.target.getAttribute("highestbid"));
    console.log(selectbid);
    setselecttype("NFT");
    setModalShow(true);
  }
  function activateDonateNFTModal(e) {
    //Activating Donate NFT Modal
    setDonateModalShow(true);
  }
  function activateDirectDonateModal(e) {
    //Activating Direct Donate Modal
    setDirectModalShow(true);
  }

  async function distributeNFTs(e) {
    //Distributte NFTs funciton
    var distributeNFTBTN = document.getElementById("distributeNFTBTN");
    distributeNFTBTN.disabled = true;
    try {
      //Calling smart contract method(functon) to Distribut in Smart Contract
      await window.nearcontract.distribute_nft({ "event_id": Number(eventId) }, "60000000000000")

    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={`${styles.container} flex flex-col items-center gap-8`}>
        <div className={`${styles.title} flex flex-col gap-2`}>
          <h1 className="text-moon-32 font-bold pb-2">{title}</h1>
          <div>
            <span className="text-trunks">Address: </span>
            <a className="text-piccolo" href={`/user/` + EventWallet}>
              {EventWallet}
            </a>
          </div>
          <div className="text-hit font-bold" name="date" date={date}>{dateleftBid}</div>

          <p>{EventDescription}</p>
        </div>
        <div className={`${styles.title} flex gap-4 justify-start`}>
          <a
            className={`tab block px-3 cursor-pointer py-2 ${selectTab === "overview" ? "active" : ""
              }`}
            onClick={() => setselectTab("overview")}
          >
            Overview
          </a>
          <a
            className={`tab block cursor-pointer px-3 py-2 ${selectTab === "nfts" ? "active" : ""
              }`}
            onClick={() => setselectTab("nfts")}
          >
            Auction NFTs ({list.length})
          </a>
        </div>
        <div className={styles.divider}></div>
        {selectTab === "overview" ? (
          <>
            <div className={`${styles["slideshow-container"]} flex gap-8`}>
              <div className="flex-1 rounded-xl overflow-hidden flex">
                <img type={imageList[0]?.type} src={imageList[0]?.url} alt="" />
              </div>
              {/* <SlideShow className={styles.slideshow} images={imageList} /> */}
              <Card height={468} width={300}>
                <div className="flex flex-col h-full gap-5">
                  <div className="flex justify-center">
                    <GenericLoyalty className="text-moon-48" color="#40A69F" />
                  </div>
                  <h2 className="text-moon-20 font-bold">
                    Raised {EventEarned} NEAR of {goal} NEAR
                  </h2>
                  <p className="text-trunks">
                    NFT donations are put up for bidding at the event.
                  </p>
                  <div className="flex flex-col gap-1">
                    <>
                      {EventWaiting === true && EventEnd !== "Finished" ? (
                        <Button
                          id="distributeNFTBTN"
                          data-element-id="btn_donate"
                          data-analytic-event-listener="true"
                          onClick={distributeNFTs}
                        >
                          Distribute NFTs to highest bidders
                        </Button>
                      ) : EventEnd !== "Finished" ? (
                        (selectedAddress !== AccountAddress) ? (<>
                          <>
                            <Button
                              data-element-id="btn_donate"
                              data-analytic-event-listener="true"
                              onClick={activateDonateNFTModal}
                            >
                              Donate NFT
                            </Button>
                            <Button
                              variant="secondary"
                              data-element-id="btn_donate"
                              data-analytic-event-listener="true"
                              onClick={activateDirectDonateModal}
                            >
                              Donate coin
                            </Button>
                          </>
                        </>) : (<></>)

                      ) : (
                        <p className="text-dodoria font-bold">
                          Auction has ended
                        </p>
                      )}
                    </>
                  </div>
                  <div className="flex flex-col justify-end flex-1 text-moon-14 text-trunks">
                    99.9% of the proceeds go to the charity. Just 0.1% goes to
                    GreenDAO.
                  </div>
                </div>
              </Card>
            </div>
          </>
        ) : (
          <>
            <div
              className="flex gap-8 flex-wrap justify-start"
              style={{ width: 960 }}
            >
              {list.map((listItem, index) => (
                <Card key={index} width={460}>
                  <div className="flex flex-col gap-5 justify-center items-center flex-1">
                    <div className={styles["nft-image"]}>
                      <img src={listItem.image} />
                    </div>
                    <div className={`gap-4 flex flex-col flex-1`}>
                      <h6 className="text-moon-20">
                        <span className="font-bold">Token name </span>
                        {listItem.name}
                      </h6>
                      <p className="text-trunks flex-1">
                        {listItem.description}
                      </p>
                      <p>
                        Highest bid is{" "}
                        <span className="font-bold">{listItem.price} NEAR</span>
                        <br />
                        <span
                          className="whitespace-nowrap truncate"
                          style={{ maxWidth: 412 }}
                        >
                          by{" "}
                          <a
                            className="text-piccolo"
                            href={`/user/${listItem.highestbidder}`}
                          >
                            {listItem.highestbidder}
                          </a>
                        </span>
                      </p>
                      <div className="flex flex-col gap-2 items-center">

                        {EventWaiting === false && EventEnd !== "Finished" ? (<>
                          <Button
                            tokenid={listItem.Id}
                            highestbid={listItem.price}
                            onClick={activateBidNFTModal}
                            style={{ width: 240 }}
                            iconLeft
                          >
                            <ControlsPlus className="text-moon-24" />
                            <div
                              tokenid={listItem.Id}
                              highestbid={listItem.price}
                              className="card BidcontainerCard"
                            >
                              <div
                                tokenid={listItem.Id}
                                highestbid={listItem.price}
                                className="card-body bidbuttonText"
                              >
                                Place higher bid
                              </div>
                            </div>
                          </Button>
                        </>) : (<></>)}
                        <Button
                          tokenid={listItem.Id}
                          title={listItem.name}
                          onClick={activateViewBidModal}
                          variant="secondary"
                          style={{ width: 240 }}
                          iconLeft
                        >
                          <TimeClock className="text-moon-24" />
                          <div
                            tokenid={listItem.Id}
                            title={listItem.name}
                            className="card BidcontainerCard"
                          >
                            <div
                              tokenid={listItem.Id}
                              title={listItem.name}
                              className="card-body bidbuttonText"
                            >
                              View bid history
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>

      <BidNFTModal //Showing Bid NFT Modal
        show={modalShow}
        onHide={() => {
          setModalShow(false);
          fetchContractData();
        }}
        tokenId={selectid}
        toAddress={selectedAddress}
        type={selecttype}
        eventId={eventId}
        Highestbid={selectbid}
      />

      <ViewBidNFTModal //Showing View Bid NFT Modal
        show={ViewmodalShow}
        onHide={() => {
          setViewModalShow(false);
          fetchContractData();
        }}
        id={selectid}
        title={selecttitle}
      />
      <DonateNFTModal //Showing Donate NFT Modal
        show={DonatemodalShow}
        onHide={() => {
          setDonateModalShow(false);
        }}
        EventID={eventId}
        type={"NFT"}
        SelectedTitle={title}
        enddate={SelectedendDate}
        EventWallet={EventWallet}
      />
      <DirectDonateModal //Showing Direct Donate Modal
        show={DirectModalShow}
        onHide={() => {
          setDirectModalShow(false);
        }}
        eventId={eventId}
        EventWallet={EventWallet}
      />
    </>
  );
}
