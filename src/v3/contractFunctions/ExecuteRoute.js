const sendTransaction = require('./SendTransaction')
const getTokenTransferApproval = require('./GetTokenTransferApproval')

module.exports = async (route, provider, wallet, inputToken) => {
        const tokenApproval = await getTokenTransferApproval(inputToken, wallet, provider)

        if (tokenApproval !== 'Sent') {
            return 'Failed'
        }

        const res = await sendTransaction({
            data: route.methodParameters?.calldata,
            to: '0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD',
            value: route?.methodParameters?.value,
            from: process.env.WALLET_ADDRESS,
            gasLimit: 50000
        }, provider, wallet)

        return res;
    }
