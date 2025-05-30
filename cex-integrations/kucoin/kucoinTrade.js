// kucoinTrade.js – KuCoin Spot Trading Bot for OCOS/BTC
require('dotenv').config();
const { KuCoin } = require('kucoin-node-sdk');

KuCoin.init({
  apiKey: process.env.KUCOIN_API_KEY,
  secretKey: process.env.KUCOIN_API_SECRET,
  passPhrase: process.env.KUCOIN_API_PASSPHRASE,
  environment: 'live' // Use 'sandbox' for test mode
});

const SYMBOL = 'OCOS-BTC'; // KuCoin-də ticarət cütü

// ✅ Balansı yoxlamaq
async function checkBalance(asset) {
  try {
    const res = await KuCoin.rest.User.Account.getAccountsList();
    const assetBalance = res.data.find(acc => acc.currency === asset && acc.type === 'trade');
    console.log(`🔍 ${asset} Balance: ${assetBalance?.available || '0'}`);
    return assetBalance?.available || '0';
  } catch (err) {
    console.error('❌ KuCoin balance error:', err.message);
  }
}

// ✅ Qiyməti almaq
async function getPrice() {
  try {
    const res = await KuCoin.rest.Market.Symbols.getTicker({ symbol: SYMBOL });
    const price = res.data.price;
    console.log(`💲 OCOS/BTC Price: ${price}`);
    return price;
  } catch (err) {
    console.error('❌ KuCoin price fetch error:', err.message);
  }
}

// ✅ Alış əməliyyatı
async function buyOCOS(sizeInBTC) {
  try {
    const order = await KuCoin.rest.Trade.Orders.postOrder({
      clientOid: Date.now().toString(),
      side: 'buy',
      symbol: SYMBOL,
      type: 'market',
      funds: sizeInBTC // Amount in BTC
    });
    console.log(`✅ Buy Order: ${order.data}`);
    return order.data;
  } catch (err) {
    console.error('❌ KuCoin buy error:', err.message);
  }
}

// ✅ Satış əməliyyatı
async function sellOCOS(sizeInOCOS) {
  try {
    const order = await KuCoin.rest.Trade.Orders.postOrder({
      clientOid: Date.now().toString(),
      side: 'sell',
      symbol: SYMBOL,
      type: 'market',
      size: sizeInOCOS
    });
    console.log(`✅ Sell Order: ${order.data}`);
    return order.data;
  } catch (err) {
    console.error('❌ KuCoin sell error:', err.message);
  }
}

// ✅ Test funksiyası
async function main() {
  await checkBalance('BTC');
  await getPrice();
  // await buyOCOS('0.0005'); // BTC olaraq alış
  // await sellOCOS('100');   // OCOS olaraq satış
}

main();
