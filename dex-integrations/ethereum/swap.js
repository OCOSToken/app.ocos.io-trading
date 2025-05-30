// swap.js – Ethereum üzərindən WBTC ilə OCOS swap
require('dotenv').config();
const Web3 = require('web3');
const fs = require('fs');

// ENV dəyişənləri
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PROVIDER_URL = process.env.ETH_PROVIDER || 'https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID';
const CONTRACT_ADDRESS = 'YOUR_DEPLOYED_SWAPBRIDGE_ADDRESS';
const ABI = JSON.parse(fs.readFileSync('./contracts/OCOSSwapBridge.json', 'utf8'));

const AMOUNT_IN_WBTC = '0.01'; // BTC şəklində, dəyişdirilə bilər

async function main() {
  const web3 = new Web3(PROVIDER_URL);
  const account = web3.eth.accounts.wallet.add(PRIVATE_KEY);

  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

  const amountInWei = web3.utils.toWei(AMOUNT_IN_WBTC, 'ether');

  try {
    const gasPrice = await web3.eth.getGasPrice();

    console.log(`Swapping ${AMOUNT_IN_WBTC} WBTC to OCOS...`);

    const tx = await contract.methods
      .swapWithWBTC(amountInWei)
      .send({
        from: account.address,
        gas: 200000,
        gasPrice,
      });

    console.log(`✅ Success! TX Hash: ${tx.transactionHash}`);
  } catch (err) {
    console.error(`❌ Error during swap: ${err.message}`);
  }
}

main();
