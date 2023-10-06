
const { ChainId, CurrencyAmount, TradeType, Percent } = require('@uniswap/sdk-core');
const { AlphaRouter, WETH_POLYGON_MUMBAI, SwapType, WMATIC_POLYGON_MUMBAI } = require('@uniswap/smart-order-router');
const { fromReadableAmount } = require('./helpers');

module.exports = async (provider) => {
    const router = new AlphaRouter({
        chainId: ChainId.POLYGON_MUMBAI,
        provider
    });
    
    const route = await router.route(
        CurrencyAmount.fromRawAmount(
            WETH_POLYGON_MUMBAI,
            fromReadableAmount(
                0.05,
                18
            ).toString()
        ),
        WMATIC_POLYGON_MUMBAI,
        TradeType.EXACT_OUTPUT,
        {
            recipient: process.env.WALLET_ADDRESS,
            deadline: Math.floor(Date.now() / 1000 + 1800),
            slippageTolerance: new Percent(50, 10_000),
            type: SwapType.UNIVERSAL_ROUTER
        }
    )

    return route;
}