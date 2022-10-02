import React, { useState, useEffect } from "react";
import isServer from "../../../components/isServer";
import Card from "../../../components/components/Card/Card";
import styles from "../User.module.css";
import { Button } from "@heathmont/moon-core-tw";

export default function NFTComponent({
  Id,
  EventID,
  name,
  description,
  image,
  signer,
  wallet,
  isGifted,
  showingFunc,
  unwrapingFunc,
}) {
  if (isServer()) return <></>;

  return (
    <>
      <Card width={460}>
        <div className="flex flex-col gap-5 justify-center items-center flex-1">
          <div className={`flex ${styles["nft-image"]}`}>
            <img className="object-cover" src={image} />
          </div>
          <div className={`gap-4 flex flex-col flex-1`}>
            <h6 className="text-moon-20">
              <span className="font-bold">Token name</span>
              {name}
            </h6>
            <p className="text-trunks">
              {description}
            </p>
          </div>
          {signer !== wallet ? (
            <></>
          ) : (
            <>
              {isGifted !== "True" ? (
                <>
                  <div className="flex justify-center">
                    <Button
                      style={{ width: 248 }}
                      onClick={() => {
                        showingFunc(Id, EventID);
                      }}
                    >
                      Send as Giftcard
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="LSPs-infos">
                    <Button
                      style={{ width: 248 }}
                      onClick={() => {
                        unwrapingFunc(Id, EventID);
                      }}
                    >
                      Unwrap Giftcard
                    </Button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Card>
    </>
  );
}
