// Script to check fundraiser status and verify transfer functionality

const { ethers } = require('hardhat');

async function main() {
  const contractAddress = process.env.VITE_FUNDRAISING_CONTRACT_ADDRESS;
  
  if (!contractAddress || contractAddress === '0x0000000000000000000000000000000000000000') {
    console.error('❌ Contract address not set in .env file!');
    console.log('Please run: npm run deploy:local');
    process.exit(1);
  }

  console.log('\n📋 Checking Fundraiser Status\n');
  console.log('='.repeat(80));
  console.log(`Contract Address: ${contractAddress}\n`);

  try {
    const Fundraising = await ethers.getContractFactory('Fundraising');
    const contract = await Fundraising.attach(contractAddress);

    // Get fundraiser count
    const nextId = await contract.getNextFundraiserId();
    const count = Number(nextId) - 1;
    
    console.log(`Total Fundraisers: ${count}\n`);

    if (count === 0) {
      console.log('⚠️  No fundraisers found. Create a fundraiser first.');
      process.exit(0);
    }

    // Check each fundraiser
    for (let i = 1; i <= count; i++) {
      console.log(`\n${'='.repeat(80)}`);
      console.log(`Fundraiser #${i}`);
      console.log('-'.repeat(80));
      
      try {
        const fundraiser = await contract.getFundraiser(i);
        
        const raisedAmount = ethers.formatEther(fundraiser.raisedAmount);
        const targetAmount = ethers.formatEther(fundraiser.targetAmount);
        const recipient = fundraiser.recipient;
        const owner = fundraiser.owner;
        const isActive = fundraiser.isActive;

        console.log(`Name: ${fundraiser.name}`);
        console.log(`Location: ${fundraiser.location}`);
        console.log(`Owner: ${owner}`);
        console.log(`Recipient: ${recipient}`);
        console.log(`Raised Amount: ${raisedAmount} ETH`);
        console.log(`Target Amount: ${targetAmount} ETH`);
        console.log(`Is Active: ${isActive}`);
        console.log(`Progress: ${((Number(raisedAmount) / Number(targetAmount)) * 100).toFixed(2)}%`);

        // Check recipient balance
        const recipientBalance = await ethers.provider.getBalance(recipient);
        console.log(`\nRecipient Balance: ${ethers.formatEther(recipientBalance)} ETH`);

        // Check contract balance
        const contractBalance = await ethers.provider.getBalance(contractAddress);
        console.log(`Contract Balance: ${ethers.formatEther(contractBalance)} ETH`);

        // Warnings
        if (Number(raisedAmount) > 0 && Number(raisedAmount) >= Number(targetAmount)) {
          console.log('\n⚠️  WARNING: Target reached but funds not transferred!');
          console.log('   Auto-transfer should have occurred.');
        }

        if (Number(raisedAmount) > 0 && contractBalance === BigInt(0)) {
          console.log('\n⚠️  WARNING: Funds in raisedAmount but contract has no balance!');
          console.log('   This should not happen. Contract may have issues.');
        }

        if (Number(raisedAmount) === 0 && Number(targetAmount) > 0) {
          console.log('\n✅ Funds already transferred (raisedAmount = 0)');
        }

      } catch (error) {
        console.error(`Error checking fundraiser #${i}:`, error.message);
      }
    }

    console.log('\n' + '='.repeat(80));
    console.log('\n💡 Tips:');
    console.log('   - If raisedAmount > 0, you can withdraw manually');
    console.log('   - If raisedAmount >= targetAmount, auto-transfer should occur on next donation');
    console.log('   - Check recipient wallet balance to verify transfers');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\nPossible issues:');
    console.log('  1. Contract not deployed - run: npm run deploy:local');
    console.log('  2. Wrong contract address in .env');
    console.log('  3. Hardhat node not running - run: npm run node');
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error:', error);
    process.exit(1);
  });
