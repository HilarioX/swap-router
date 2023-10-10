require('dotenv').config();

const ethers = require('ethers');

const generateRoute = require('./contractFunctions/GenerateRoute');
const executeRoute = require('./contractFunctions/ExecuteRoute');
const { Token, ChainId } = require('@uniswap/sdk-core');

const url = process.env.RPC_URL;
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, customHttpProvider)
  
const outputToken = new Token(ChainId.GOERLI, '0x326C977E6efc84E512bB9C30f76E30c160eD06FB', 18, 'LINK') //token que vai ser comprada
const inputToken = new Token(ChainId.GOERLI, '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', 18, 'UNI') //token que está na reserva para ser gasto nas compras
    

  async function makeRoute() {
    const route = await generateRoute(customHttpProvider, inputToken, outputToken); 
    const result = await executeRoute(route, customHttpProvider, wallet, inputToken)

    return result
}
  makeRoute().then((res)=>{console.log(res)})