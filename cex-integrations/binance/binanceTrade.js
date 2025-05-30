// binanceTrade.js – Binance Spot Trading Bot for OCOS/BTC
require('dotenv').config();
const Binance = require('node-binance-api');

const binance = new Binance().options({
  APIKEY: process.env.BINANCE_API_KEY,
  APISECRET: process.env.BINANCE_API_SECRET,
  useServerTime: true,
  recvWindow: 60000
});

const PAIR = 'OCOSBTC'; // OCOS/BTC ticarət cütlüyü

// ✅ Balansı yoxlamaq
async function checkBalance(asset) {
  try {
    const balance = await binance.balance();
    console.log(`🔍 ${asset} balance:`, balance[asset]?.available || '0');
    return balance[asset]?.available || '0';
  } catch (err) {
    console.error('❌ Balance check error:', err.body);
  }
}

// ✅ Qiyməti almaq
async function getPrice() {
  try {
    const ticker = await binance.prices(PAIR);
    console.log(`💲 OCOS/BTC Price:`, ticker[PAIR]);
    return ticker[PAIR];
  } catch (err) {
    console.error('❌ Price fetch error:', err.body);
  }
}

// ✅ Alış əməliyyatı
async function buyOCOS(amountBTC) {
  try {
    const order = await binance.marketBuy(PAIR, amountBTC);
    console.log(`✅ Buy Order Placed:`, order);
    return order;
  } catch (err) {
    console.error('❌ Buy Error:', err.body);
  }
}

// ✅ Satış əməliyyatı
async function sellOCOS(quantityOCOS) {
  try {
    const order = await binance.marketSell(PAIR, quantityOCOS);
    console.log(`✅ Sell Order Placed:`, order);
    return order;
  } catch (err) {
    console.error('❌ Sell Error:', err.body);
  }
}

// ✅ Əsas test funksiyası
async function main() {
  await checkBalance('BTC');
  await getPrice();
  // await buyOCOS(0.0005);       // Alış əməliyyatı nümunəsi
  // await sellOCOS(100);         // Satış əməliyyatı nümunəsi
}

main();
