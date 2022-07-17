const express = require("express");
const ethers = require("ethers");
const abi = require("./abi/seaport.abi.json");
require("dotenv").config();
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: process.env.POSTGRES_USER || "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  database: process.env.POSTGRES_DB || "test",
  password: process.env.POSTGRES_PASSWORD || "1234",
  port: process.env.PORT || "5432"
});

const app = express();

app.get('/', (req, res) => {
  res.status(200).json('starting...')
});

async function start() {
  console.log(pool)
    const PORT = 8089;
    await main();
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}.`)
    });
}

async function main() {
    console.log(process.env.API_KEY)
  const seaPortAddress = '0x00000000006c3852cbEf3e08E8dF289169EdE581'
  const provider =  
  new ethers.providers.WebSocketProvider(
    `wss://eth-mainnet.g.alchemy.com/v2/${process.env.API_KEY}`,
  )
  const contract =  new ethers.Contract(seaPortAddress, abi, provider);
  // contract.on("OrderFulfilled", (orderHash,offerer,zone,fulfiller,spentItems,receivedItems)=>{
  //     console.log(spentItems)
  // })

  contract.on("OrderFulfilled", (
    orderHash,
    offerer,
    zone,
    fulfiller,
    spentItems,
    receivedItems
) => {
  let totalAmountSpent = 0;
  let numberOfTokensOffered = spentItems.length;
  offer = spentItems.map((ele, idx) => {
      return {
          itemType: ele.itemType,
          token_addr: ele.token,
          token_id: ethers.utils.formatUnits(ele.identifier, 0),
          amount: ethers.utils.formatUnits(ele.amount, 0)
      }
  })

  consideration = receivedItems.map((ele, idx) => {
    totalAmountSpent += Number(ethers.utils.formatUnits(ele.amount, 18))
      return {
          itemType: ele.itemType,
          token_addr: ele.token,
          token_id: ethers.utils.formatUnits(ele.identifier, 0),
          amount: ethers.utils.formatUnits(ele.amount, 18),
          recipient: ele.recipient
      }
  })


  offer.map((item) => {
    if (item.itemType !== 2) return;
    let quer = `INSERT INTO seaport_sales(order_hash, offerer, recipient, token_id, token_address, quantity, amount) 
  VALUES('${orderHash}', '${offerer}', '${fulfiller}', ${item.token_id}, '${item.token_addr}', ${item.amount}, ${totalAmountSpent/numberOfTokensOffered})`;
  pool.query(quer,
  (err, res) => {
    console.log(err, res);
  })

  console.log(quer);
  })
  // console.log(totalAmountSpent)

  
})
}



start();