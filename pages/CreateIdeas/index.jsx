import React, { useEffect, useState } from "react";
import Head from "next/head";
import UseFormInput from "../../components/components/UseFormInput";
import UseFormTextArea from "../../components/components/UseFormTextArea";
import { Header } from "../../components/layout/Header";
import NavLink from "next/link";
import isServer from "../../components/isServer";
import { NFTStorage, File } from "nft.storage";
import Web3 from "web3";
import styles from "./CreateIdeas.module.css";
import { Button } from "@heathmont/moon-core-tw";
import { GenericPicture, ControlsPlus } from "@heathmont/moon-icons-tw";
import { Checkbox } from "@heathmont/moon-core-tw";

export default function CreateIdeas() {
  const [IdeasImage, setIdeasImage] = useState([]);
  if (isServer()) return null;

  //Storage API for images and videos
  const NFT_STORAGE_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDJDMDBFOGEzZEEwNzA5ZkI5MUQ1MDVmNDVGNUUwY0Q4YUYyRTMwN0MiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY1NDQ3MTgxOTY2NSwibmFtZSI6IlplbmNvbiJ9.6znEiSkiLKZX-a9q-CKvr4x7HS675EDdaXP622VmYs8";
  const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });

  //Input fields
  const [IdeasTitle, IdeasTitleInput] = UseFormInput({
    defaultValue: "",
    type: "text",
    placeholder: "Ideas name",
    id: "",
  });

  const [IdeasDescription, IdeasDescriptionInput] = UseFormTextArea({
    defaultValue: "",
    placeholder: "Ideas Description",
    id: "",
    rows: 4,
  });



  let id = -1;




  //Function after clicking Create Ideas Button
  async function createIdeas() {
    var CreateIdeasBTN = document.getElementById("CreateIdeasBTN");
    CreateIdeasBTN.disabled = true;
    let allFiles = [];
    for (let index = 0; index < IdeasImage.length; index++) {
      //Gathering all files link
      const element = IdeasImage[index];
      const metadata = await client.storeBlob(element);
      const urlImageIdeas = {
        url: "https://" + metadata + ".ipfs.nftstorage.link",
        type: element.type,
      };
      allFiles.push(urlImageIdeas);
    }

    //Creating an object of all information to store in EVM
    const createdObject = {
      title: "Asset Metadata",
      type: "object",
      properties: {
        Title: {
          type: "string",
          description: IdeasTitle,
        },
        Description: {
          type: "string",
          description: IdeasDescription,
        },  
        wallet: {
          type: "string",
          description: window.accountId,
        },       
        logo: {
          type: "string",
          description: allFiles[0],
        },       
        allFiles,
      },
    };
    console.log("======================>Creating Ideas");
    try {
     
      // Creating Ideas in Rust Smart contract
      await window.nearcontract.create_ideas({ "_ideas_uri": JSON.stringify(createdObject),"_goal_id": Number(id) }, "60000000000000")

    } catch (error) {
      console.error(error);
      // window.location.href = "/login?[/]"; //If found any error then it will let the user to login page
    }
  }

  function CreateIdeasBTN() {
    return (
      <>
        <div className="flex gap-4 justify-end">
          <NavLink href="/donations">
            <Button variant="secondary">Cancel</Button>
          </NavLink>
          <Button id="CreateIdeasBTN" onClick={createIdeas}>
            <ControlsPlus className="text-moon-24" />
            Create ideas
          </Button>
        </div>
      </>
    );
  }
  function FilehandleChange(ideas) {
    // If user uploaded images/videos
    var allNames = [];
    for (let index = 0; index < ideas.target.files.length; index++) {
      const element = ideas.target.files[index].name;
      allNames.push(element);
    }
    for (let index2 = 0; index2 < ideas.target.files.length; index2++) {
      setIdeasImage((pre) => [...pre, ideas.target.files[index2]]);
    }
  }
  if (!isServer()) {
    const regex = /\[(.*)\]/g;
    const str = decodeURIComponent(window.location.search);
    let m;

    while ((m = regex.exec(str)) !== null) {
      // This is necessary to avoid infinite loops with zero-width matches
      if (m.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      id = m[1];
    }
  }
  async function CheckTransaction() {
    let params = (new URL(window.location)).searchParams;
    if (params.get("transactionHashes") !== null) {
      window.location.href = `daos/dao/goal?[${id}]`;
    }
  }
 
  CheckTransaction();

  function AddBTNClick(ideas) {
    //Clicking on +(Add) Function
    var IdeasImagePic = document.getElementById("IdeasImage");
    IdeasImagePic.click();
  }

  function DeleteSelectedImages(ideas) {
    //Deleting the selected image
    var DeleteBTN = ideas.currentTarget;
    var idImage = Number(DeleteBTN.getAttribute("id"));
    var newImages = [];
    var allUploadedImages = document.getElementsByName("deleteBTN");
    for (let index = 0; index < IdeasImage.length; index++) {
      if (index != idImage) {
        const elementDeleteBTN = allUploadedImages[index];
        elementDeleteBTN.setAttribute("id", newImages.length.toString());
        const element = IdeasImage[index];
        newImages.push(element);
      }
    }
    setIdeasImage(newImages);
  }

  return (
    <>
      <Head>
        <title>Create Ideas</title>
        <meta name="description" content="Create Ideas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header></Header>
      <div
        className={`${styles.container} flex items-center justify-center flex-col gap-8`}
      >
        <div className={`${styles.title} gap-8 flex flex-col`}>
          <h1 className="text-moon-32 font-bold">Create ideas</h1>

        </div>
        <div className={styles.divider}></div>
        <div className={`${styles.form} flex flex-col gap-8`}>
          <div>
            <h6>Ideas name</h6>
            {IdeasTitleInput}
          </div>

          <div>
            <h6>Description</h6>
            {IdeasDescriptionInput}
          </div>
         
          <div className="flex flex-col gap-2 h-56">
            <h6>Content</h6>
            <div style={{borderColor: '#6578F2'}} className="border-4 border-dashed content-start flex flex-row flex-wrap gap-4 h-full inset-0 justify-start m-auto overflow-auto p-1 relative text-center text-white w-full z-20">
              <input
                className="file-input"
                hidden
                onChange={FilehandleChange}
                id="IdeasImage"
                name="IdeasImage"
                type="file"
                multiple="multiple"
              />
              <div className="flex gap-4">
                {IdeasImage.map((item, i) => {
                  return (
                    <>
                      <div key={i} className="flex gap-4">
                        <button
                          onClick={DeleteSelectedImages}
                          name="deleteBTN"
                          id={i}
                        >
                          {item.type.includes("image") ? (
                            <img
                              className={styles.image}
                              src={URL.createObjectURL(item)}
                            />
                          ) : (
                            <>
                              <div className={styles.video}>

                                <span className="Ideas-Uploaded-File-name">
                                  {item.name.substring(0, 10)}...
                                </span>
                              </div>
                            </>
                          )}
                        </button>
                      </div>
                    </>
                  );
                })}
                <div className="Ideas-ImageAdd">
                  <Button
                    id="Add-Image"
                    onClick={AddBTNClick}
                    variant="secondary"
                    style={{ height: 80, padding: "1.5rem" }}
                    iconLeft
                    size="lg"
                  >
                    <GenericPicture className="text-moon-24" />
                    Add Content
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <CreateIdeasBTN />
        </div>
        <div className={styles.divider}></div>
      </div>
    </>
  );
}
