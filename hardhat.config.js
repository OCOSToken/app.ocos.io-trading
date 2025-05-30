require('@nomiclabs/hardhat-ethers');
require('dotenv').config();

module.exports = {
  defaultNetwork: "goerli", // Dəyiş: bscTestnet, polygon, mainnet, və s.
  networks: {
    goerli: {
      url: process.env.ETH_PROVIDER, // Infura və ya Alchemy
      accounts: [process.env.PRIVATE_KEY]
    },
    bscTestnet: {
      url: "https://data-seed-prebsc-1-s1.binance.org:8545/",
      accounts: [process.env.PRIVATE_KEY]
    },
    polygonMumbai: {
      url: "https://rpc-mumbai.maticvigil.com",
      accounts: [process.env.PRIVATE_KEY]
    }
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
};
