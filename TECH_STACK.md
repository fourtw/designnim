# Tech Stack & Technology Documentation

Dokumentasi lengkap tentang teknologi, library, dan tools yang digunakan dalam proyek **Panti Jompo Link**.

## 📋 Daftar Isi

- [Frontend Technologies](#frontend-technologies)
- [Blockchain & Web3](#blockchain--web3)
- [Smart Contract Development](#smart-contract-development)
- [Build Tools & Development](#build-tools--development)
- [Styling & UI](#styling--ui)
- [State Management & Data Fetching](#state-management--data-fetching)
- [Utilities & Helpers](#utilities--helpers)
- [Development Dependencies](#development-dependencies)
- [Architecture Overview](#architecture-overview)

---

## Frontend Technologies

### React 18.3.1
**Purpose**: Library utama untuk membangun user interface
- **Type**: JavaScript library untuk UI
- **Version**: 18.3.1
- **Usage**: 
  - Component-based architecture
  - Hooks untuk state management dan side effects
  - JSX untuk templating
- **Why**: Industry standard, excellent ecosystem, great performance dengan Virtual DOM

### TypeScript 5.9.3
**Purpose**: Type-safe JavaScript
- **Type**: Programming language (superset of JavaScript)
- **Version**: 5.9.3
- **Usage**: 
  - Type safety untuk semua komponen
  - Interface dan type definitions
  - Better IDE support dan autocomplete
- **Why**: Mengurangi bugs, meningkatkan developer experience, better code maintainability

### Vite 7.2.4
**Purpose**: Build tool dan development server
- **Type**: Build tool / Bundler
- **Version**: 7.2.4
- **Usage**: 
  - Development server dengan HMR (Hot Module Replacement)
  - Production build optimization
  - Fast build times dengan esbuild
- **Why**: Sangat cepat, modern, better DX dibanding Webpack

---

## Blockchain & Web3

### Wagmi 3.0.1
**Purpose**: React hooks untuk Ethereum/Polygon
- **Type**: React hooks library
- **Version**: 3.0.1
- **Usage**: 
  - `useAccount()` - Get connected wallet
  - `useConnect()` - Connect wallet
  - `useBalance()` - Get token balance
  - `useReadContract()` - Read from smart contract
  - `useWriteContract()` - Write to smart contract
  - `useSwitchChain()` - Switch blockchain network
- **Why**: Simplifies Web3 interactions, type-safe, excellent React integration

### Viem 2.40.2
**Purpose**: Low-level library untuk Ethereum interactions
- **Type**: TypeScript library
- **Version**: 2.40.2
- **Usage**: 
  - Format units (wei ↔ ether)
  - Parse ether untuk transactions
  - Type definitions untuk addresses
  - Utility functions untuk blockchain
- **Why**: Type-safe, modern alternative to ethers.js, used by Wagmi under the hood

### Ethers.js 6.15.0
**Purpose**: Ethereum library (used by Hardhat)
- **Type**: JavaScript library
- **Version**: 6.15.0
- **Usage**: 
  - Smart contract interactions
  - Transaction signing
  - Provider management
- **Why**: Industry standard, comprehensive features, used by Hardhat

---

## Smart Contract Development

### Solidity 0.8.20
**Purpose**: Programming language untuk smart contracts
- **Type**: Programming language
- **Version**: 0.8.20
- **Usage**: 
  - Write smart contract logic
  - Define data structures
  - Handle events dan transactions
- **Why**: Standard untuk Ethereum/Polygon smart contracts, well-documented

### Hardhat 2.22.0
**Purpose**: Development environment untuk Ethereum
- **Type**: Development framework
- **Version**: 2.22.0
- **Usage**: 
  - Compile Solidity contracts
  - Deploy contracts to networks
  - Run tests
  - Debug transactions
- **Why**: Best-in-class tooling, great debugging, plugin ecosystem

### @nomicfoundation/hardhat-toolbox 5.0.0
**Purpose**: Hardhat plugin bundle
- **Type**: Hardhat plugin
- **Version**: 5.0.0
- **Usage**: 
  - Includes ethers, hardhat-ethers, hardhat-verify
  - Network configuration
  - Contract verification on PolygonScan
- **Why**: Convenient bundle, includes all essential tools

---

## Build Tools & Development

### @vitejs/plugin-react 5.1.1
**Purpose**: Vite plugin untuk React
- **Type**: Vite plugin
- **Version**: 5.1.1
- **Usage**: 
  - Enable React Fast Refresh
  - JSX transformation
  - React-specific optimizations
- **Why**: Required untuk menggunakan React dengan Vite

### Autoprefixer 10.4.22
**Purpose**: CSS vendor prefixing
- **Type**: PostCSS plugin
- **Version**: 10.4.22
- **Usage**: 
  - Auto-add vendor prefixes
  - Browser compatibility
- **Why**: Ensures CSS works across browsers

### PostCSS 8.5.6
**Purpose**: CSS processing tool
- **Type**: CSS tool
- **Version**: 8.5.6
- **Usage**: 
  - Process Tailwind CSS
  - Run Autoprefixer
- **Why**: Required untuk Tailwind CSS

---

## Styling & UI

### Tailwind CSS 3.4.14
**Purpose**: Utility-first CSS framework
- **Type**: CSS framework
- **Version**: 3.4.14
- **Usage**: 
  - Utility classes untuk styling
  - Responsive design
  - Custom theme configuration
- **Why**: Fast development, consistent design, small bundle size

### Lucide React 0.554.0
**Purpose**: Icon library
- **Type**: Icon component library
- **Version**: 0.554.0
- **Usage**: 
  - UI icons (Wallet, Heart, etc.)
  - Consistent icon design
- **Why**: Beautiful icons, tree-shakeable, React-friendly

---

## State Management & Data Fetching

### @tanstack/react-query 5.90.10
**Purpose**: Data fetching dan caching
- **Type**: Data fetching library
- **Version**: 5.90.10
- **Usage**: 
  - Cache blockchain data
  - Automatic refetching
  - Background updates
- **Why**: Excellent untuk async data, used by Wagmi internally

### React Hot Toast 2.6.0
**Purpose**: Toast notifications
- **Type**: Notification library
- **Version**: 2.6.0
- **Usage**: 
  - Success/error notifications
  - Transaction status updates
  - User feedback
- **Why**: Beautiful, lightweight, easy to use

---

## Utilities & Helpers

### Dotenv 16.4.5
**Purpose**: Environment variable management
- **Type**: Utility library
- **Version**: 16.4.5
- **Usage**: 
  - Load `.env` files
  - Secure configuration
- **Why**: Standard untuk environment variables

---

## Development Dependencies

### @types/react 18.3.27
**Purpose**: TypeScript types untuk React
- **Type**: Type definitions
- **Version**: 18.3.27

### @types/react-dom 18.3.7
**Purpose**: TypeScript types untuk React DOM
- **Type**: Type definitions
- **Version**: 18.3.7

---

## Architecture Overview

### Project Structure

```
designnim/
├── contracts/              # Smart contracts (Solidity)
│   └── Fundraising.sol
├── scripts/                # Deployment scripts
│   └── deploy.ts
├── src/
│   ├── components/         # React components
│   │   ├── Header.tsx
│   │   ├── Hero.tsx
│   │   ├── FundraisersList.tsx
│   │   ├── DonationModal.tsx
│   │   └── CreateFundraiserForm.tsx
│   ├── hooks/              # Custom React hooks
│   │   ├── useWalletConnect.ts
│   │   ├── useFundraising.ts
│   │   └── useDonate.ts
│   ├── lib/                # Utilities & configs
│   │   ├── wagmi.ts        # Wagmi configuration
│   │   ├── constants.ts    # App constants
│   │   ├── abi.ts          # Contract ABIs
│   │   └── walletDetection.ts
│   ├── types.ts            # TypeScript types
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
├── hardhat.config.ts       # Hardhat configuration
├── package.json            # Dependencies
└── vite.config.ts          # Vite configuration
```

### Data Flow

1. **User Interaction** → React Component
2. **Component** → Custom Hook (useWalletConnect, useFundraising)
3. **Hook** → Wagmi hooks (useConnect, useWriteContract)
4. **Wagmi** → Viem (blockchain interactions)
5. **Blockchain** → Polygon Network
6. **Response** → React Query (caching)
7. **Update** → React Component (re-render)

### Key Technologies by Layer

| Layer | Technology |
|-------|-----------|
| **UI** | React 18 + TypeScript |
| **Styling** | Tailwind CSS |
| **Web3** | Wagmi + Viem |
| **Smart Contracts** | Solidity 0.8.20 |
| **Development** | Hardhat + Vite |
| **Build** | Vite + esbuild |
| **State** | React Hooks + React Query |

---

## Network Configuration

### Polygon Mumbai (Testnet)
- **Chain ID**: 80001
- **RPC URL**: Configurable via environment variables
- **Block Explorer**: https://mumbai.polygonscan.com
- **Native Token**: MATIC (testnet)

### Polygon Mainnet (Production)
- **Chain ID**: 137
- **RPC URL**: Configurable via environment variables
- **Block Explorer**: https://polygonscan.com
- **Native Token**: MATIC

---

## Development Workflow

1. **Smart Contract Development**
   - Write contract in `contracts/Fundraising.sol`
   - Compile: `npm run compile`
   - Deploy: `npm run deploy:mumbai`

2. **Frontend Development**
   - Start dev server: `npm run dev`
   - Hot reload enabled
   - TypeScript type checking

3. **Testing**
   - Test wallet connection
   - Test contract interactions
   - Verify on PolygonScan

---

## Security Considerations

- ✅ **No hardcoded private keys** - Using environment variables
- ✅ **Type safety** - TypeScript untuk prevent errors
- ✅ **Input validation** - Smart contract validations
- ✅ **Error handling** - Comprehensive error messages
- ✅ **Network validation** - Check correct network before transactions

---

## Performance Optimizations

- **Vite**: Fast builds dengan esbuild
- **React Query**: Automatic caching dan background refetching
- **Tailwind CSS**: Purge unused CSS in production
- **Code splitting**: Vite automatic code splitting
- **Tree shaking**: Remove unused code

---

## Browser Support

- Chrome/Edge (recommended)
- Firefox
- Brave
- Safari (with MetaMask)

**Required**: MetaMask extension untuk wallet functionality

---

## Future Considerations

### Potential Additions
- **WalletConnect**: Mobile wallet support
- **The Graph**: Indexed blockchain data
- **IPFS**: Decentralized storage untuk images
- **React Router**: Multi-page navigation (if needed)
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright atau Cypress

---

## Resources & Documentation

- [React Documentation](https://react.dev)
- [Wagmi Documentation](https://wagmi.sh)
- [Viem Documentation](https://viem.sh)
- [Hardhat Documentation](https://hardhat.org)
- [Solidity Documentation](https://docs.soliditylang.org)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Polygon Documentation](https://docs.polygon.technology)

---

**Last Updated**: 2024
**Project Version**: 1.0.0
