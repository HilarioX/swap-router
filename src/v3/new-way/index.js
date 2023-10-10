const { ethers } = require("ethers");
const { SwapRouter } = require("@uniswap/v3-sdk");

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);

module.exports = async () => {
    const swapRouterAddress = "0xE592427A0AEce92De3Edee1F18E0157C05861564"; // SwapRouter address on Mumbai network
    const swapRouter = new SwapRouter(swapRouterAddress, provider);

    const tokenIn = "0x2791bca1f2de4661ed88a30c99a7a9449aa84174"; // USDC token address on Mumbai network
    const tokenOut = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063"; // DAI token address on Mumbai network
    const amountIn = ethers.utils.parseUnits("100", 6); // 100 USDC
    const amountOutMinimum = ethers.utils.parseUnits("200", 18); // Minimum 200 DAI
    const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes from now
    const options = {
    fee: 3000, // 0.3% fee
    recipient: "0x1234567890123456789012345678901234567890", // Your wallet address
    deadline: deadline,
    };

    const uncheckedTrade = await swapRouter.exactInputSingle({
        tokenIn: tokenIn,
        tokenOut: tokenOut,
        fee: options.fee,
        recipient: options.recipient,
        deadline: options.deadline,
        amountIn: amountIn,
        amountOutMinimum: amountOutMinimum,
    });

    const methodParameters = SwapRouter.swapCallParameters([uncheckedTrade], options);

    const signer = new ethers.Wallet("YOUR_PRIVATE_KEY", provider); // Replace with your private key
    const tx = await signer.sendTransaction({
    to: swapRouterAddress,
    data: methodParameters,
    gasLimit: 3000000, // Adjust the gas limit as needed
    });

    return tx;
}