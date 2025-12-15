# Local Network Setup Guide

Panduan untuk menjalankan aplikasi di local Hardhat network untuk testing tanpa perlu testnet.

## 🚀 Quick Start

### 1. Start Local Hardhat Node

Buka terminal pertama dan jalankan:

```bash
npm run node
```

Ini akan:
- ✅ Start local blockchain node di `http://127.0.0.1:8545`
- ✅ Generate 20 test accounts dengan 10000 ETH each
- ✅ Menampilkan private keys dan addresses untuk testing

**Jangan tutup terminal ini!** Biarkan tetap running.

### 2. Setup Environment

Buat file `.env` dari template:

```bash
Copy-Item env.example .env
```

Edit `.env` dan set:

```env
VITE_POLYGON_NETWORK=local
VITE_POLYGON_RPC_URL=http://127.0.0.1:8545
```

**Catatan**: Untuk local network, `PRIVATE_KEY` tidak diperlukan karena Hardhat sudah menyediakan test accounts.

### 3. Deploy Smart Contract ke Local Network

Buka terminal kedua (jangan tutup terminal pertama) dan jalankan:

```bash
npm run deploy:local
```

Script akan:
- ✅ Deploy contract ke local network
- ✅ Otomatis update `.env` dengan contract address
- ✅ Menampilkan contract address

### 4. Add Local Network ke MetaMask

1. Buka MetaMask
2. Klik network dropdown (biasanya "Ethereum Mainnet")
3. Scroll ke bawah, klik "Add Network" atau "Add a network manually"
4. Isi dengan:
   - **Network Name**: `Hardhat Local`
   - **RPC URL**: `http://127.0.0.1:8545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
   - **Block Explorer URL**: (kosongkan)

5. Klik "Save"

### 5. Import Test Account ke MetaMask

Dari output `npm run node`, copy salah satu private key (bukan mnemonic).

1. Buka MetaMask
2. Klik account icon (kanan atas)
3. Klik "Import Account"
4. Paste private key
5. Klik "Import"

Sekarang Anda punya test account dengan 10000 ETH di local network!

### 6. Start Frontend

Buka terminal ketiga dan jalankan:

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:5173`

### 7. Connect Wallet

1. Pastikan MetaMask sudah di network "Hardhat Local"
2. Klik "Connect Wallet" di aplikasi
3. Pilih account yang sudah di-import
4. Approve connection

## 📋 Testing Checklist

- [ ] Local node running (`npm run node`)
- [ ] Contract deployed (`npm run deploy:local`)
- [ ] `.env` file configured dengan `VITE_POLYGON_NETWORK=local`
- [ ] MetaMask connected ke "Hardhat Local" network
- [ ] Test account imported dengan ETH
- [ ] Frontend running (`npm run dev`)
- [ ] Wallet connected di aplikasi

## 🎯 Test Scenarios

### Create Fundraiser
1. Klik "Buat Fundraiser Baru"
2. Isi form dengan data test
3. Submit transaction
4. Approve di MetaMask (gas fee = 0 di local network)
5. Fundraiser akan muncul di list

### Donate
1. Pilih fundraiser dari list
2. Klik "Lihat & Donasi"
3. Masukkan jumlah donasi
4. Submit transaction
5. Approve di MetaMask
6. Donasi akan tercatat on-chain

### Withdraw Funds
1. Connect dengan wallet yang membuat fundraiser
2. Klik "Withdraw" (jika ada)
3. Approve transaction
4. Funds akan dikirim ke recipient address

## 🔧 Troubleshooting

### Error: "Cannot connect to local network"

**Solusi:**
- Pastikan `npm run node` masih running
- Check apakah port 8545 tidak digunakan aplikasi lain
- Restart local node: Stop (`Ctrl+C`) dan jalankan lagi `npm run node`

### Error: "Contract not deployed"

**Solusi:**
- Pastikan sudah deploy: `npm run deploy:local`
- Check `.env` file - `VITE_FUNDRAISING_CONTRACT_ADDRESS` harus ada
- Restart dev server setelah deploy
- Hard refresh browser: `Ctrl+Shift+R`

### MetaMask: "This network is not supported"

**Solusi:**
- Pastikan Chain ID = 1337
- Pastikan RPC URL = `http://127.0.0.1:8545`
- Coba hapus dan tambah network lagi di MetaMask

### Transaction stuck atau pending

**Solusi:**
- Di local network, transaction biasanya instant
- Jika stuck, reset MetaMask account:
  1. Settings → Advanced → Reset Account
  2. Atau restart local node

### Account tidak punya ETH

**Solusi:**
- Local node memberikan 10000 ETH per account otomatis
- Jika tidak ada, import account lain dari output `npm run node`
- Atau transfer dari account lain menggunakan Hardhat console

## 💡 Tips

1. **Keep Terminal Open**: Jangan tutup terminal yang menjalankan `npm run node`
2. **Reset State**: Setiap kali restart `npm run node`, semua state akan reset (termasuk deployed contracts)
3. **Fast Testing**: Local network sangat cepat - tidak perlu menunggu block confirmation
4. **Free Gas**: Semua transaction di local network gratis (gas = 0)
5. **Multiple Accounts**: Gunakan beberapa test accounts untuk testing different scenarios

## 🔄 Reset Everything

Jika ingin reset semua:

1. Stop local node: `Ctrl+C` di terminal `npm run node`
2. Stop dev server: `Ctrl+C` di terminal `npm run dev`
3. Deploy ulang contract: `npm run deploy:local`
4. Restart dev server: `npm run dev`
5. Refresh browser

## 📚 Next Steps

Setelah testing di local network berhasil:

1. **Deploy ke Amoy Testnet**: `npm run deploy:amoy`
2. **Update `.env`**: Set `VITE_POLYGON_NETWORK=amoy`
3. **Get Test MATIC**: Dari [Polygon Faucet](https://faucet.polygon.technology/)
4. **Switch MetaMask**: Ke Polygon Amoy network
5. **Test di Testnet**: Ulangi semua test scenarios

## 🎓 Learn More

- [Hardhat Network Documentation](https://hardhat.org/hardhat-network/docs)
- [Hardhat Local Node Guide](https://hardhat.org/hardhat-network/docs/guides/forking-other-networks)
