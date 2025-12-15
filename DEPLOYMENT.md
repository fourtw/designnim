# Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Prerequisites Setup

#### Install MetaMask
1. Install [MetaMask](https://metamask.io/) browser extension
2. Create or import a wallet
3. Add Polygon Amoy testnet:
   - Network Name: `Polygon Amoy`
   - RPC URL: `https://rpc-amoy.polygon.technology`
   - Chain ID: `80002`
   - Currency Symbol: `MATIC`
   - Block Explorer: `https://amoy.polygonscan.com`

**Note**: Mumbai testnet is deprecated. Use Amoy testnet instead.

#### Get Test MATIC
1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Request test MATIC for your wallet address
3. Wait for confirmation (may take a few minutes)

### 2. Environment Configuration

#### Get RPC URL
Choose one provider:

**Option A: Public RPC (Recommended)**
- Use the public RPC: `https://rpc-amoy.polygon.technology`
- No signup required, free to use

**Option B: Infura**
1. Sign up at [infura.io](https://infura.io)
2. Create a new project
3. Select "Polygon" network
4. Copy the Amoy testnet RPC URL

**Option C: Alchemy**
1. Sign up at [alchemy.com](https://alchemy.com)
2. Create a new app
3. Select "Polygon" and "Amoy" network
4. Copy the HTTP URL

**Option D: QuickNode**
1. Sign up at [quicknode.com](https://quicknode.com)
2. Create an endpoint for Polygon Amoy
3. Copy the HTTP URL

#### Create .env File
1. Copy `env.example` to `.env`
2. Fill in your RPC URL:
```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
VITE_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
VITE_POLYGON_NETWORK=amoy
```

3. Add your private key (for deployment only):
```env
PRIVATE_KEY=your_private_key_here
```

⚠️ **WARNING**: Never commit `.env` to git! It's already in `.gitignore`.

### 3. Install Dependencies

```bash
npm install
```

### 4. Compile Smart Contract

```bash
npm run compile
```

This will:
- Compile the Solidity contract
- Generate ABI files in `artifacts/`
- Create TypeScript types

### 5. Deploy Smart Contract

#### Deploy to Amoy Testnet

```bash
npm run deploy:amoy
```

**Note**: Mumbai testnet is deprecated. Use Amoy testnet instead.

Expected output:
```
Deploying Fundraising contract...
Fundraising contract deployed to: 0x...
Please update your .env file with:
VITE_FUNDRAISING_CONTRACT_ADDRESS=0x...
```

#### Update .env File

Add the deployed contract address:
```env
VITE_FUNDRAISING_CONTRACT_ADDRESS=0xYourDeployedAddress
```

### 6. (Optional) Verify Contract

If you have a PolygonScan API key:

1. Get API key from [PolygonScan](https://polygonscan.com/apis)
2. Add to `.env`:
```env
POLYGONSCAN_API_KEY=your_api_key
```

3. Verify contract:
```bash
npx hardhat verify --network amoy <CONTRACT_ADDRESS>
```

### 7. Run Frontend

```bash
npm run dev
```

The app will start at `http://localhost:5173`

### 8. Test the Application

1. **Connect Wallet**
   - Click "Connect Wallet"
   - Approve MetaMask connection
   - Ensure you're on Amoy testnet

2. **Create a Fundraiser**
   - Click "Buat Fundraiser Baru"
   - Fill in the form:
     - Name: "Panti Jompo Test"
     - Location: "Jakarta"
     - Description: "Test fundraiser"
     - Target: "10" MATIC
     - Recipient: Your wallet address
   - Submit and confirm in MetaMask

3. **Make a Donation**
   - Browse fundraisers
   - Click on a fundraiser
   - Enter donation amount
   - Confirm transaction

4. **View on PolygonScan**
   - Click transaction links
   - Verify transactions on-chain

## Troubleshooting

### "Contract address is zero"
- Ensure `VITE_FUNDRAISING_CONTRACT_ADDRESS` is set in `.env`
- Restart dev server after updating `.env`

### "Insufficient funds"
- Get more test MATIC from faucet
- Check wallet balance in MetaMask

### "Network mismatch"
- Ensure MetaMask is on Polygon Amoy
- Check `VITE_POLYGON_NETWORK=amoy` in `.env`

### "RPC error"
- Verify RPC URL is correct
- Check if RPC provider has rate limits
- Try a different RPC provider

### Contract deployment fails
- Verify private key has MATIC
- Check RPC URL is accessible
- Ensure network is correct in Hardhat config

## Production Deployment

### Deploy to Polygon Mainnet

1. Update `.env`:
```env
VITE_POLYGON_NETWORK=mainnet
POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com
```

2. Deploy contract:
```bash
npm run deploy:polygon
```

3. Update contract address in `.env`

4. Build frontend:
```bash
npm run build
```

5. Deploy `dist/` folder to hosting (Vercel, Netlify, etc.)

### Security Checklist

- [ ] Contract audited
- [ ] Private keys secured
- [ ] Environment variables not exposed
- [ ] Error handling implemented
- [ ] User testing completed
- [ ] Documentation updated

## Support

For issues:
1. Check README.md troubleshooting section
2. Review contract code in `contracts/Fundraising.sol`
3. Check PolygonScan for transaction status
4. Verify all environment variables are set correctly
