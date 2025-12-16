require('@nomicfoundation/hardhat-toolbox');
const dotenv = require('dotenv');

dotenv.config();

/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 1337,
      // Enable accounts for local testing
      accounts: {
        mnemonic: process.env.MNEMONIC || 'test test test test test test test test test test test junk',
        count: 20,
        accountsBalance: '10000000000000000000000', // 10000 ETH per account
      },
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      chainId: 1337,
      // For local network we usually don't need a PRIVATE_KEY; Hardhat node provides accounts.
      accounts: undefined,
    },
    amoy: {
      url: process.env.POLYGON_AMOY_RPC_URL || 'https://rpc-amoy.polygon.technology',
      // Use PRIVATE_KEY only if it looks valid (0x + 64 hex chars)
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY.startsWith('0x') &&
        process.env.PRIVATE_KEY.length === 66
          ? [process.env.PRIVATE_KEY]
          : [],
      chainId: 80002,
    },
    // Keep mumbai for backward compatibility (deprecated)
    mumbai: {
      url: process.env.POLYGON_MUMBAI_RPC_URL || 'https://polygon-mumbai.infura.io/v3/YOUR_INFURA_KEY',
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY.startsWith('0x') &&
        process.env.PRIVATE_KEY.length === 66
          ? [process.env.PRIVATE_KEY]
          : [],
      chainId: 80001,
    },
    polygon: {
      url: process.env.POLYGON_MAINNET_RPC_URL || 'https://polygon-rpc.com',
      accounts:
        process.env.PRIVATE_KEY &&
        process.env.PRIVATE_KEY.startsWith('0x') &&
        process.env.PRIVATE_KEY.length === 66
          ? [process.env.PRIVATE_KEY]
          : [],
      chainId: 137,
    },
  },
  etherscan: {
    apiKey: {
      polygonAmoy: process.env.POLYGONSCAN_API_KEY || '',
      polygonMumbai: process.env.POLYGONSCAN_API_KEY || '',
      polygon: process.env.POLYGONSCAN_API_KEY || '',
    },
  },
  paths: {
    sources: './contracts',
    tests: './test',
    cache: './cache',
    artifacts: './artifacts',
  },
};

module.exports = config;
