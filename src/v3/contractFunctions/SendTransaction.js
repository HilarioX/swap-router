const { BigNumber } = require('ethers')
module.exports = async (transaction, provider, wallet) => {
  if (transaction.value) {
    transaction.value = BigNumber.from(transaction.value)
  }

  const txRes = await wallet.sendTransaction(transaction)
  let receipt = null

  while (receipt === null) {
    try {
      receipt = await provider.getTransactionReceipt(txRes.hash)

      if (receipt === null) {
        continue
      }
    } catch (e) {
      console.log(`Receipt error:`, e)
      break
    }
  }

  if (receipt) {
    return {
      status: 'Sent',
      receipt,
      txRes
    }
  } else {
    return { status: 'Failed' }
  }
}