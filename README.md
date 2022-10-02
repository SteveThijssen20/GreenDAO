This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started



First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

# How everything works
## Creating charity event and Donating NFT
On GreenDAO an event manager can create an auction charity event with the deadline and wallet address. It will ask Universal Profile Extension to confirm. After that, all the created charity eevnt will show in donation page. On any of these charity event users can go into Auction page. There donors can donate(or mint) their NFTs with a given bid price to that charity event. So, that other donors can bid on that NFT. 

## Distributing the NFTs to the highest bidders
When the auction deadline is ended then the charity event status shows "Waiting for NFTs release". At that moment, only the owner can view this auction page. And owner can finish the Auction and transfer the NFTs to won highest bidders by clicking "Distribute NFTs". It will ask for UP confirmation. After aporving it all the money will be transfered to the Event wallet address. And the Auction will be end. 

## User profile
https://<host>:3000/user/<address> 
Here address is the user wallet address. On this page user can see user details as well as LSP 9 NFTs, LSP12 Issued Tokens and LSP5 Recieved Tokens. 

### LSP9 NFTs
    Here user can see all his won NFTs from the charity events. Here has 2 types of NFTs. They are Own NFT and Gifted NFT. 
        Own NFT:
            He can send NFT as Giftcard to a recipient. On the Send as Gift Card modal, there has Recipient address, message, Font type, And the name. After changes this he can also preview the gift card and send his Gift card.
        Gifted NFT:
            If anyone has sent the Gift card, then he can see there a button called Unwrap gift card. And here he can see the Gift card in preview. After wraping it he got the authority to send it to another person as Gift card.
### LSP12 Issued Tokens
    Here LSP7 and LSP8 tokens are displaying with mark. Also here is displaying the Supply of these tokens.
### LSP 5 Recieved Tokens
    Here is showing the Tokens with the balance. Here showing the collection and normal token.


### Challanges
## Fashion, Art, Music, Entertainment - Open Category
On GreenDAO, User can donate Fashion, Art, Music, Entertainment images or videos as NFT on Charity Event. And all the money will go to event manager wallet. And thus any Charity event manager can earn donation from users using GreenDAO. And it is also empowering artists, designers, musicians, creatives, fans etc person to promote their work as NFT. 
