const ethers = require("ethers");
const abi = require("../abi/seaport.abi.json");
require("dotenv").config();

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
    let k = spentItems.length;
    let m = receivedItems.length;
    let info = {orderHash, offerer, zone, fulfiller, spentItems, receivedItems};

    console.log(info)
})
}

main();