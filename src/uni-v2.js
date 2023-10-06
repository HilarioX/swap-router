require('dotenv').config()
const { ChainId, Fetcher, Route, Trade, TokenAmount, TradeType } = require ('@uniswap/sdk');
const ethers = require('ethers');  

const url = process.env.RPC_URL;
const customHttpProvider = new ethers.providers.JsonRpcProvider(url);

const chainId = ChainId.MAINNET;
const daiAddress = '0x6B175474E89094C44Da98b954EedeAC495271d0F'
const linkAddress  = '0x514910771AF9Ca656af840dff83E8264EcF986CA'

const init = async () => {
    const [dai, link] = await Promise.all([
        Fetcher.fetchTokenData(chainId, daiAddress, customHttpProvider),
        Fetcher.fetchTokenData(chainId, linkAddress, customHttpProvider)
    ]);
    
    const pair = await Fetcher.fetchPairData(dai, link, customHttpProvider);
    const route = new Route([pair], link);
    const trade = new Trade(route, new TokenAmount(link, '100000000000000000'), TradeType.EXACT_INPUT);
    console.log("Mid Price LINK --> DAI:", route.midPrice.toSignificant(6));
    console.log("Mid Price DAI --> LINK:", route.midPrice.invert().toSignificant(6));
    console.log("-".repeat(45));
    console.log("Execution Price LINK --> DAI:", trade.executionPrice.toSignificant(6));
    console.log("Mid Price after trade LINK --> DAI:", trade.nextMidPrice.toSignificant(6));
}

init();