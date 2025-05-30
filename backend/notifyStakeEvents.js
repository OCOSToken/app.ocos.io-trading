require('dotenv').config();
const { ethers } = require('ethers');
const TelegramBot = require('node-telegram-bot-api');
const nodemailer = require('nodemailer');
const fs = require('fs');

const ABI = JSON.parse(fs.readFileSync('./contracts/LiquidityVault.json', 'utf8'));
const CONTRACT_ADDRESS = process.env.LIQUIDITY_VAULT_ADDRESS;

const provider = new ethers.providers.JsonRpcProvider(process.env.ETH_PROVIDER);
const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);

// Telegram Bot setup
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });
const telegramChatId = process.env.TELEGRAM_CHAT_ID;

// Email setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASS
  }
});

// Notify via Telegram
function notifyTelegram(message) {
  bot.sendMessage(telegramChatId, `📢 ${message}`);
}

// Notify via Email
function notifyEmail(subject, message) {
  transporter.sendMail({
    from: `"OCOS Notifier" <${process.env.SMTP_EMAIL}>`,
    to: process.env.NOTIFY_EMAIL,
    subject,
    text: message
  });
}

// Event: Staked
contract.on("Staked", (user, amount, time) => {
  const msg = `🟢 Stake Alert:\nUser: ${user}\nAmount: ${ethers.utils.formatEther(amount)} OCOS\nTime: ${new Date(time * 1000).toLocaleString()}`;
  console.log(msg);
  notifyTelegram(msg);
  notifyEmail("OCOS Stake Alert", msg);
});

// Event: Withdrawn
contract.on("Withdrawn", (user, amount, reward) => {
  const msg = `🔴 Withdraw Alert:\nUser: ${user}\nPrincipal: ${ethers.utils.formatEther(amount)} OCOS\nReward: ${ethers.utils.formatEther(reward)} OCOS`;
  console.log(msg);
  notifyTelegram(msg);
  notifyEmail("OCOS Withdraw Alert", msg);
});
