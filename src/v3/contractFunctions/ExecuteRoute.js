const sendTransaction = require('./SendTransaction')
const getTokenTransferApproval = require('./GetTokenTransferApproval')
const { WETH_POLYGON_MUMBAI } = require('@uniswap/smart-order-router')

module.exports = async (route, provider, wallet) => {
        const tokenApproval = await getTokenTransferApproval(WETH_POLYGON_MUMBAI, wallet, provider)

        if (tokenApproval !== 'Sent') {
            return 'Failed'
        }

        const res = await sendTransaction({
            data: route.methodParameters?.calldata,
            to: '0x3fc91a3afd70395cd496c647d5a6cc9d4b2b7fad',
            value: route?.methodParameters?.value,
            from: process.env.WALLET_ADDRESS,
            gasLimit: 21000,
            maxFeePerGas: 1000000000,
            maxPriorityFeePerGas: 100000000,
        }, provider, wallet)

        return res;
    }
