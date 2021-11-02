
// $(document).ready(function(){
//     dapp2();
//   });
  const dapp2 = async()=>{
      var contract;
     const Web3 = require('web3');
      // Set up web3 object, connected to the local development network
      const web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:7545"));
      const latestBlockNumber = await web3.eth.getBlockNumber()
      console.log("latestBlockNumber: "+latestBlockNumber);

      //
      var address = '0xC656478C1E37Ba233d8baEeF59001867010DcE57';
      contract = new web3.eth.Contract(address);
  }
  module.exports = dapp2;

