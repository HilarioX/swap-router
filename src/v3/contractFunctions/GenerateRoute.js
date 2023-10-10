
const { ChainId, CurrencyAmount, TradeType, Percent, Token} = require('@uniswap/sdk-core');
const { AlphaRouter, SwapType } = require('@uniswap/smart-order-router');
const { fromReadableAmount } = require('./helpers');

module.exports = async (provider, inputToken, outputToken) => {
    const router = new AlphaRouter({
        chainId: ChainId.GOERLI,
        provider
    });

    
    const route = await router.route(
        CurrencyAmount.fromRawAmount(
            outputToken,
            fromReadableAmount(1, 18).toString()
        ),
        inputToken,
        TradeType.EXACT_OUTPUT,
        {
            recipient: process.env.WALLET_ADDRESS,
            slippageTolerance: new Percent(50, 10_000),
            deadline: Math.floor(Date.now() / 1000 + 1800),
            type: SwapType.UNIVERSAL_ROUTER,

        }
    );

    const info = { 
      input: `${route.trade.inputAmount.toExact()} ${route.route[0].tokenPath[0].symbol}`,
      output: `${route.trade.outputAmount.toExact()} ${route.route[0].tokenPath.at(-1).symbol}`,
      routePath: `${route.route[0].tokenPath.map(token => token.symbol)}`,
      interactionPath: route.route[0].route.pools.map(pool => `${pool.token0.symbol} <-> ${pool.token1.symbol}`),
      iteractedPoolsList: route.route[0].poolAddresses 
    }

    console.log(info)
    
    return route;
}

