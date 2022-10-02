import { Button } from "@heathmont/moon-core-tw";
import { ControlsPlus, TimeClock } from "@heathmont/moon-icons-tw";
import Head from "next/head";
import { useEffect, useState } from "react";
import NavLink from "next/link";
import ChooseProjectModal from '../../../../../components/components/modals/ChooseProjectModal';
import SlideShow from '../../../../../components/components/Slideshow';
import { GenericLoyalty } from "@heathmont/moon-icons-tw";

import Card from "../../../../../components/components/Card/Card";
import isServer from "../../../../../components/isServer";
import { Header } from "../../../../../components/layout/Header";
import styles from "../../../daos.module.css";
let IdeasEnd = "";
let IdeasWaiting = false;

export default function GrantIdeas() {
  //variables
  const [eventId, setIdeasId] = useState(-1);
  const [list, setList] = useState([]);
  const [imageList, setimageList] = useState([]);
  const [IdeasURI, setIdeasURI] = useState({ ideasId: "", Title: "", Description: "", wallet: "", logo: "", End_Date:"",voted:0, allfiles: [] });

  const [AccountAddress, setAccountAddress] = useState("");

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
  let id = ""; //Ideas id from url
  let Goalid = ""; //Goal id
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
    if (IdeasEnd === "Finished" && s.toString().includes("-")) {
      return "Ideas Ended";
    } else if (
      s.toString().includes("-") &&
      IdeasWaiting === true &&
      IdeasEnd !== "Finished"
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
        setIdeasId(id); //setting Ideas id
        id = Number(id);

        const allUri = JSON.parse(await window.nearcontract.ideas_uri({ "ideas_id": Number(id) })); //Getting total ideas (Number)
        const ideaURI = JSON.parse(allUri[1]);
        Goalid = Number(allUri[0]);
        const goalURI = JSON.parse(JSON.parse(await window.nearcontract.goal_uri({ "goal_id": Goalid }))[1]); //Getting total goal (Number)

        const Allvotes = JSON.parse(await window.nearcontract.get_ideas_votes_from_goal({ "goal_id": Goalid,"ideas_id": Number(id) })); //Getting total goal (Number)

        setIdeasURI({
          ideasId: id,
          Title: ideaURI.properties.Title.description,
          Description: ideaURI.properties.Description.description,
          wallet: ideaURI.properties.wallet.description,
          logo: ideaURI.properties.logo.description.url,
          End_Date:goalURI.properties.End_Date?.description,
          voted:Object.keys(Allvotes).length,
          allfiles: ideaURI.properties.allFiles
        })

        setimageList(ideaURI.properties.allFiles);

        if (document.getElementById("Loading"))
          document.getElementById("Loading").style = "display:none";


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





  async function VoteIdees() {
    await window.nearcontract.create_goal_ideas_vote({ "goal_id": Goalid, "ideas_id": Number(id), "wallet": window.accountId }, "60000000000000");
  }


  return (
    <>
      <Head>
        <title>{IdeasURI.Title}</title>
        <meta name="description" content={IdeasURI.Title} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div className={`${styles.container} flex flex-col items-center gap-8`}>
        <div className={`${styles.title} flex flex-col gap-2`}>
          <h1 className="text-moon-32 font-bold pb-2">{IdeasURI.Title}</h1>
          <div>
            <a className="text-piccolo" dateleft={IdeasURI.End_Date}>
              {LeftDate(IdeasURI.End_Date)}
            </a>
          </div>
          <p>{IdeasURI.Description}</p>
          <p>Voted: {IdeasURI.voted}</p>
        </div>
        <div className={`${styles.tabtitle} flex gap-4 justify-start`}>
          <a className={`tab block px-3 cursor-pointer py-2 text-3xl text-[#0000ff]`} >
            Ideas
          </a>
          <Button data-element-id="btn_donate" style={{width: '147px'}} data-analytic-event-listener="true" onClick={() => { VoteIdees() }}>
            Vote
          </Button>
        </div>
        <div className={styles.divider}></div>
        <>
          <div className={`flex gap-8`}>
            {/* <div className="flex-1 rounded-xl overflow-hidden flex">
              <img type={imageList[0]?.type} src={imageList[0]?.url} alt="" />
            </div> */}
            <SlideShow className={styles.slideshow} images={imageList} />
          
          </div>
        </>
      </div>

    </>
  );
}
