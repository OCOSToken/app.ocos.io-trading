// trade.js — OCOS Trading API Router
const express = require('express');
const router = express.Router();
const { exec } = require('child_process');

// ✅ POST /api/trade/dex
// Trigger DEX swap via selected chain
router.post('/dex', async (req, res) => {
  const { chain, amount } = req.body;

  if (!chain || !amount) {
    return res.status(400).json({ error: 'Chain and amount are required' });
  }

  let scriptPath;
  switch (chain.toLowerCase()) {
    case 'ethereum':
      scriptPath = 'dex-integrations/ethereum/swap.js';
      break;
    case 'bsc':
      scriptPath = 'dex-integrations/bsc/swap.js';
      break;
    case 'polygon':
      scriptPath = 'dex-integrations/polygon/swap.js';
      break;
    default:
      return res.status(400).json({ error: 'Unsupported chain' });
  }

  exec(`AMOUNT=${amount} node ${scriptPath}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.status(200).json({ message: 'DEX swap executed', output: stdout });
  });
});

// ✅ POST /api/trade/cex
// Execute CEX trade via selected exchange
router.post('/cex', async (req, res) => {
  const { exchange, type, size } = req.body;

  if (!exchange || !type || !size) {
    return res.status(400).json({ error: 'Exchange, type, and size are required' });
  }

  let scriptPath;
  if (exchange === 'binance') {
    scriptPath = 'cex-integrations/binance/binanceTrade.js';
  } else if (exchange === 'kucoin') {
    scriptPath = 'cex-integrations/kucoin/kucoinTrade.js';
  } else {
    return res.status(400).json({ error: 'Unsupported exchange' });
  }

  // Dynamically pass size/type as environment vars
  exec(`TYPE=${type} SIZE=${size} node ${scriptPath}`, (err, stdout, stderr) => {
    if (err) return res.status(500).json({ error: stderr });
    res.status(200).json({ message: 'CEX trade executed', output: stdout });
  });
});

module.exports = router;
