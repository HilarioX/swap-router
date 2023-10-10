const { ethers } = require('ethers');
const JSBI = require('jsbi')

const sendTransaction = require('./SendTransaction');
const { abi: ERC20_ABI } = require('@uniswap/v3-core/artifacts/contracts/interfaces/IERC20Minimal.sol/IERC20Minimal.json')

function countDecimals(x) {
  if (Math.floor(x) === x) {
    return 0
  }
  return x.toString().split('.')[1].length || 0
}

function fromReadableAmount(amount, decimals) {
  const extraDigits = Math.pow(10, countDecimals(amount))
  const adjustedAmount = amount * extraDigits
  return JSBI.divide(
    JSBI.multiply(
      JSBI.BigInt(adjustedAmount),
      JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
    ),
    JSBI.BigInt(extraDigits)
  )
}

function toReadableAmount(rawAmount, decimals) {
  return JSBI.divide(
    JSBI.BigInt(rawAmount),
    JSBI.exponentiate(JSBI.BigInt(10), JSBI.BigInt(decimals))
  ).toString()
}

module.exports = async (token, wallet, provider) => {
  try {
    const tokenContract = new ethers.Contract(
      token.address,
      ERC20_ABI,
      provider
    )

    const transaction = await tokenContract.populateTransaction.approve(
      '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
      '5000000000000000'
    )

    return sendTransaction({
      ...transaction,
      from: wallet.address,
    },
    provider, wallet)
  } catch (e) {
    console.error(e)
    return 'Failed'
  }
}