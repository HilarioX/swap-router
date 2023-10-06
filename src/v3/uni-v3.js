require('dotenv').config();

const ethers = require('ethers');
const generateRoute = require('./contractFunctions/GenerateRoute');
const executeRoute = require('./contractFunctions/ExecuteRoute');

const { DAI_POLYGON_MUMBAI } = require('@uniswap/smart-order-router');

const url = process.env.RPC_URL;
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

const TransactionState = {
  Failed: '',
  New: 'New',
  Rejected: 'Rejected',
  Sending: 'Sending',
  Sent: 'Sent',
}

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, customHttpProvider)

  async function makeRoute() {
    const route = await generateRoute(customHttpProvider); 
    const result = await executeRoute(route, customHttpProvider, wallet)

    console.log(result)

    return result;
}
  makeRoute().then((res)=>{console.log("done")})