import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🚀 Deploying Fundraising contract...\n");

  const Fundraising = await ethers.getContractFactory("Fundraising");
  const fundraising = await Fundraising.deploy();

  await fundraising.waitForDeployment();

  const address = await fundraising.getAddress();
  console.log("✅ Fundraising contract deployed to:", address);

  // Update .env file automatically
  const envPath = path.join(process.cwd(), ".env");
  let envContent = "";

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, "utf-8");
    
    // Check if VITE_FUNDRAISING_CONTRACT_ADDRESS already exists
    if (envContent.includes("VITE_FUNDRAISING_CONTRACT_ADDRESS=")) {
      // Update existing
      envContent = envContent.replace(
        /VITE_FUNDRAISING_CONTRACT_ADDRESS=.*/,
        `VITE_FUNDRAISING_CONTRACT_ADDRESS=${address}`
      );
    } else {
      // Add new line
      envContent += `\nVITE_FUNDRAISING_CONTRACT_ADDRESS=${address}\n`;
    }
  } else {
    // Create new .env file
    const envExamplePath = path.join(process.cwd(), "env.example");
    if (fs.existsSync(envExamplePath)) {
      envContent = fs.readFileSync(envExamplePath, "utf-8");
    }
    envContent += `\nVITE_FUNDRAISING_CONTRACT_ADDRESS=${address}\n`;
  }

  fs.writeFileSync(envPath, envContent);
  console.log("\n✅ Updated .env file with contract address");
  console.log("\n📝 Next steps:");
  console.log("   1. Restart your dev server (npm run dev)");
  console.log("   2. Refresh your browser");
  console.log("   3. Try creating a fundraiser!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
