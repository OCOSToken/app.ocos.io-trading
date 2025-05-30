# 🔁 OCOS Global Trading Infrastructure

### Dual-Mode Blockchain Trading System (DEX + CEX)  
**Project Repository for app.ocos.io Multichain Trading Framework**

---

## 📘 Overview

The **OCOS Trading Infrastructure** is a modular, scalable, and security-focused system designed to power **real-time decentralized (DEX) and centralized (CEX)** trading for the OCOS ecosystem across the **Top 10 global blockchain networks**.

This repository contains smart contracts, backend services, and frontend UI components that enable:
- Direct DEX liquidity trades (e.g., Uniswap, PancakeSwap, TraderJoe)
- Automated CEX API interactions (e.g., Binance, KuCoin, Kraken)
- Wallet-connected real-time trading from app.ocos.io
- Secure .env-based authentication and gas optimization

Whether you're a developer, trader, or institutional partner, this platform allows seamless access to cross-chain trading from a unified Web3 environment.

---

## 🌐 Supported Blockchain Networks

The following networks are supported in both smart contract and API interaction modes:

| Chain         | DEX Support        | CEX Routing | Native Tokens |
|---------------|--------------------|-------------|----------------|
| Ethereum      | Uniswap v2/v3       | Binance     | ETH             |
| BNB Chain     | PancakeSwap         | Binance     | BNB             |
| Polygon       | QuickSwap           | KuCoin      | MATIC           |
| Arbitrum      | SushiSwap/Uniswap   | -           | ETH (L2)        |
| Avalanche     | TraderJoe           | Binance     | AVAX            |
| Optimism      | Velodrome           | -           | ETH (L2)        |
| Solana        | Jupiter Aggregator  | -           | SOL             |
| Tron          | JustSwap            | -           | TRX             |
| Base          | Aerodrome           | Coinbase    | ETH             |
| Fantom        | SpookySwap          | -           | FTM             |

---

## 🧩 Architecture

app.ocos.io-trading/
├── contracts/ # Solidity smart contracts for on-chain routing
├── dex-integrations/ # Scripts for interacting with DEX routers
├── cex-integrations/ # Binance, KuCoin, Coinbase API clients
├── backend/ # Node.js server for API trading logic
├── frontend/ # Web3 dashboard for real-time user trades
├── .env.example # Template for secure key handling
├── README.md # Project documentation
└── LICENSE


---

## ⚙️ Features

✅ **Dual Mode Trading:**  
Supports both on-chain (DEX) and off-chain (CEX) routing.

✅ **Gas Optimization:**  
Built-in gas estimator and fee optimization logic for all chains.

✅ **Wallet Compatibility:**  
Connect using MetaMask, WalletConnect, Trust Wallet, Coinbase Wallet, etc.

✅ **Trade Simulation & Preview:**  
Before executing a trade, simulate slippage and fee impact in real time.

✅ **Secure API Handling:**  
All private keys and API secrets managed using encrypted `.env` variables.

✅ **Audit-Friendly Logging:**  
All trade activities are recorded with time, signature, and hash verification.

✅ **Multi-language Roadmap:**  
Documentation available in English, Azerbaijani, and Turkish (soon).

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js ≥ 18.x
- NPM or Yarn
- MetaMask or compatible Web3 wallet

---

### 🛠 Installation

```bash
# Clone the repository
git clone https://github.com/OCOSNetwork/app.ocos.io-trading.git

cd app.ocos.io-trading

# Install dependencies
npm install

# Configure environment
cp .env.example .env
