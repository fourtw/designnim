# Panti Jompo Link - Decentralized Fundraising Platform

A decentralized fundraising platform built on Polygon blockchain, specifically designed for supporting nursing homes (panti jompo) in Indonesia. This platform enables transparent, on-chain donations with full blockchain verification.

## Features

- 🔗 **Polygon Integration**: Built on Polygon Amoy testnet (easily switchable to mainnet)
- 💰 **Smart Contract Fundraising**: Solidity smart contract handles all fundraising logic
- 👛 **Wallet Connection**: Seamless MetaMask integration for Polygon-compatible wallets
- 📊 **Transparent Donations**: All transactions recorded on-chain via PolygonScan
- 🏥 **Nursing Home Focus**: Dedicated to supporting panti jompo (nursing homes)
- ✨ **Create Fundraisers**: Users can create their own fundraising campaigns
- 💸 **Real-time Updates**: Live tracking of donation progress and amounts

## Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for build tooling
- **Wagmi** & **Viem** for blockchain interactions
- **Tailwind CSS** for styling
- **React Hot Toast** for notifications

### Blockchain
- **Solidity** smart contracts
- **Hardhat** for development and deployment
- **Polygon Amoy** testnet (or Polygon mainnet)
- **ethers.js** compatible (via Viem)

## Prerequisites

Before you begin, ensure you have:

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MetaMask** browser extension installed

**For Local Network (Recommended for Testing):**
- No additional setup needed! Just run `npm run node` to start local blockchain

**For Testnet:**
- **Polygon Amoy** testnet configured in MetaMask
- A wallet with some test MATIC (get from [Polygon Faucet](https://faucet.polygon.technology/))

## Installation

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd designnim
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Network Configuration
# Options: 'local' (localhost), 'amoy' (testnet), 'mainnet'
VITE_POLYGON_NETWORK=local

# RPC URLs
# For local network:
VITE_POLYGON_RPC_URL=http://127.0.0.1:8545

# For Amoy testnet:
# POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
# VITE_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology

# Contract Address (will be set after deployment)
VITE_FUNDRAISING_CONTRACT_ADDRESS=

# Private Key for Deployment (NEVER commit to git!)
# For local network: Not required (Hardhat provides test accounts)
# For testnet/mainnet: Required
PRIVATE_KEY=your_private_key_here

# PolygonScan API Key (optional, for contract verification)
POLYGONSCAN_API_KEY=
```

### 4. Deploy Smart Contract

#### Compile the Contract

```bash
npm run compile
```

#### Option A: Deploy to Local Network (Recommended for Testing)

1. **Start local Hardhat node** (in a separate terminal):
   ```bash
   npm run node
   ```
   Keep this terminal running!

2. **Deploy to local network** (in another terminal):
   ```bash
   npm run deploy:local
   ```

3. **Add local network to MetaMask**:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

4. **Import test account** from the `npm run node` output (copy private key)

See [LOCAL_NETWORK.md](./LOCAL_NETWORK.md) for detailed local network setup guide.

#### Option B: Deploy to Amoy Testnet

```bash
npm run deploy:amoy
```

**Note**: Mumbai testnet is deprecated. Use Amoy testnet instead.

After deployment, you'll see the contract address. Update your `.env` file:

```env
VITE_FUNDRAISING_CONTRACT_ADDRESS=0xYourDeployedContractAddress
```

#### (Optional) Verify Contract on PolygonScan

```bash
npm run verify
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
designnim/
├── contracts/
│   └── Fundraising.sol          # Main smart contract
├── scripts/
│   └── deploy.ts                  # Deployment script
├── src/
│   ├── components/
│   │   ├── Header.tsx            # Header with wallet connection
│   │   ├── Hero.tsx              # Landing page hero section
│   │   ├── FundraisersList.tsx   # List of fundraisers from contract
│   │   ├── FundraiserCard.tsx   # Individual fundraiser card
│   │   ├── DonationModal.tsx     # Donation interface
│   │   ├── CreateFundraiserForm.tsx  # Form to create new fundraiser
│   │   └── ...
│   ├── hooks/
│   │   ├── useWalletConnect.ts   # Wallet connection logic
│   │   ├── useFundraising.ts     # Smart contract interactions
│   │   └── useDonate.ts          # Donation functionality
│   ├── lib/
│   │   ├── abi.ts                # Contract ABIs
│   │   ├── constants.ts          # App constants and config
│   │   └── wagmi.ts              # Wagmi configuration
│   └── App.tsx                   # Main app component
├── hardhat.config.ts             # Hardhat configuration
├── package.json
└── README.md
```

## Smart Contract Overview

The `Fundraising.sol` contract provides:

- **createFundraiser()**: Create a new fundraising campaign
- **donate()**: Make a donation to a fundraiser (payable in MATIC)
- **withdrawFunds()**: Fundraiser owner can withdraw collected funds
- **getFundraiser()**: Retrieve fundraiser details
- **getDonations()**: Get donation history for a fundraiser

### Key Features:
- Transparent on-chain tracking
- Owner-controlled withdrawals
- Active/inactive status toggle
- Event emissions for all major actions

## Usage Guide

### For Donors

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Browse Fundraisers**: View active fundraising campaigns
3. **Donate**: Click on a fundraiser card, enter donation amount, and confirm transaction
4. **View Transaction**: Click the transaction link to view on PolygonScan

### For Fundraiser Creators

1. **Connect Wallet**: Ensure your wallet is connected
2. **Create Fundraiser**: Click "Buat Fundraiser Baru" button
3. **Fill Details**:
   - Nursing home name
   - Location
   - Description
   - Target amount (in MATIC)
   - Recipient wallet address
4. **Submit**: Confirm the transaction in MetaMask
5. **Withdraw Funds**: Once donations are received, use the withdraw function (via contract interaction)

## Configuration

### Switching to Polygon Mainnet

1. Update `.env`:
```env
VITE_POLYGON_NETWORK=mainnet
POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com
```

2. Deploy to mainnet:
```bash
npm run deploy:polygon
```

3. Update contract address in `.env`

### Getting RPC URLs

- **Infura**: Sign up at [infura.io](https://infura.io) and create a Polygon project
- **Alchemy**: Sign up at [alchemy.com](https://alchemy.com) and create a Polygon app
- **QuickNode**: Sign up at [quicknode.com](https://quicknode.com)

## Security Best Practices

⚠️ **IMPORTANT**: Never commit private keys or sensitive data to git!

1. **Environment Variables**: Always use `.env` for sensitive data
2. **Private Keys**: Only use for deployment, never in frontend code
3. **Contract Verification**: Verify contracts on PolygonScan for transparency
4. **Input Validation**: Smart contract includes basic validation
5. **Wallet Security**: Users are responsible for their own wallet security

## Troubleshooting

### Wallet Connection Issues

- Ensure MetaMask is installed and unlocked
- Check that you're on Polygon Amoy testnet
- Refresh the page if connection fails
- Clear browser cache if issues persist

### Contract Deployment Issues

- Verify RPC URL is correct
- Ensure private key has test MATIC for gas
- Check network configuration in `hardhat.config.ts`

### Transaction Failures

- Ensure sufficient MATIC balance for gas
- Check network is correct (Amoy testnet)
- Verify contract address is correct in `.env`

## Development

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Run Tests (if added)

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

## Support

For issues or questions:
- Check the troubleshooting section
- Review contract code in `contracts/Fundraising.sol`
- Check PolygonScan for transaction status

## Acknowledgments

- Built for supporting nursing homes (panti jompo) in Indonesia
- Powered by Polygon blockchain
- Uses Wagmi and Viem for Web3 interactions

---

**Note**: This is a development version. For production use, ensure:
- Comprehensive testing
- Security audits
- Proper error handling
- User documentation
- Legal compliance
