const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  console.log("🚀 Deploying contract with account:", deployer.address);

  const OCOSSwapBridge = await hre.ethers.getContractFactory("OCOSSwapBridge");
  const contract = await OCOSSwapBridge.deploy(
    process.env.WBTC_ADDRESS,
    process.env.BTCB_ADDRESS,
    process.env.OCOS_TOKEN_ADDRESS,
    process.env.CHAINLINK_BTC_USD
  );

  await contract.deployed();
  console.log("✅ OCOSSwapBridge deployed to:", contract.address);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
