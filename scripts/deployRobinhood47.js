const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying Robinhood47 with account:", deployer.address);

  const Robinhood47 = await hre.ethers.getContractFactory("Robinhood47");

  const contract = await Robinhood47.deploy(
    process.env.WBTC_ADDRESS,           // WBTC token address (Ethereum)
    process.env.BTCB_ADDRESS,           // BTCB token address (BSC)
    process.env.OCOS_TOKEN_ADDRESS,     // OCOS token address
    process.env.CHAINLINK_BTC_USD       // Chainlink BTC/USD price feed
  );

  await contract.deployed();

  console.log("✅ Robinhood47 deployed to:", contract.address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
