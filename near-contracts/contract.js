import "regenerator-runtime/runtime";
import React, { useState, useEffect } from 'react'
import * as nearAPI from "near-api-js"
import getConfig from "../config"

// Initializing contract
async function initContract() {
  try {
    console.clear();
    window.nearConfig = getConfig();
    window.near = new nearAPI.Near({
      keyStore: new nearAPI.keyStores.BrowserLocalStorageKeyStore(),
      networkId: 'testnet',
      nodeUrl: 'https://rpc.testnet.near.org',
      walletUrl: 'https://wallet.testnet.near.org'
  })
 
    // Initializing Wallet based Account. It can work with NEAR TestNet wallet that
    // is hosted at https://wallet.testnet.near.org
    
    window.walletConnection = new nearAPI.WalletConnection(window.near);
  
    const wallet = window.walletConnection;
    // connect to a NEAR smart contract
    window.nearcontract = new nearAPI.Contract(wallet.account(), 'greendao-1.testnet',{
      viewMethods: ['get_all_daos','get_all_daos_from_wallet','dao_uri','get_all_goals','goal_uri','get_all_goals_by_dao_id','get_all_ideas','ideas_uri','get_all_ideas_by_goal_id','get_ideas_votes_from_goal'],
      changeMethods: ['create_dao','set_dao','reset_all','create_goal','set_goal','create_ideas','set_ideas','create_goal_ideas_vote']
    })
    // Getting the Account ID. If unauthorized yet, it's just empty string.
    window.accountId = window.walletConnection.getAccountId();
  } catch (error) {
    console.error(error)
  }
 
}

if (typeof window !== "undefined") {
  window.nearInitPromise = initContract()

  
}
// export default null;