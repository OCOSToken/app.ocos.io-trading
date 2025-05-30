const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const contractAddress = process.env.CONTRACT_TO_VERIFY;

  console.log("🔍 Verifying contract at:", contractAddress);

  await hre.run("verify:verify", {
    address: contractAddress,
    constructorArguments: [
      process.env.WBTC_ADDRESS,
      process.env.BTCB_ADDRESS,
      process.env.OCOS_TOKEN_ADDRESS,
      process.env.CHAINLINK_BTC_USD
    ]
  });

  console.log("✅ Contract verified successfully.");
}

main().catch((error) => {
  console.error("❌ Verification failed:", error.message);
  process.exitCode = 1;
});
