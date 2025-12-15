# Quick Start Guide - Deploy Contract & Create Fundraiser

## 🚀 Langkah Cepat untuk Deploy Smart Contract

### 1. Setup Environment

Buat file `.env` di root project:

```env
# Network (amoy untuk testnet, polygon untuk mainnet)
# Note: Mumbai is deprecated, use Amoy instead
VITE_POLYGON_NETWORK=amoy

# RPC URL (Amoy testnet - public RPC available)
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology
VITE_POLYGON_RPC_URL=https://rpc-amoy.polygon.technology

# Private Key untuk deployment (HANYA untuk deploy, jangan commit!)
PRIVATE_KEY=your_private_key_here

# Contract address akan di-update otomatis setelah deploy
VITE_FUNDRAISING_CONTRACT_ADDRESS=
```

### 2. Deploy Smart Contract

**Untuk Amoy Testnet (Recommended):**
```bash
npm run deploy:amoy
```

**Note**: Mumbai testnet is deprecated. Use Amoy testnet instead.

**Untuk Polygon Mainnet:**
```bash
npm run deploy:polygon
```

Script akan:
- ✅ Deploy contract ke blockchain
- ✅ Otomatis update `.env` file dengan contract address
- ✅ Menampilkan contract address

### 3. Restart Dev Server

Setelah deploy, restart dev server:

```bash
# Stop server (Ctrl+C)
# Start lagi
npm run dev
```

**PENTING**: Restart diperlukan agar aplikasi membaca contract address baru dari `.env`

### 4. Test Create Fundraiser

1. **Connect Wallet** - Klik "Connect Wallet" dan approve di MetaMask
2. **Pastikan Network Benar** - Harus di Polygon Amoy (Chain ID: 80002)
3. **Klik "Buat Fundraiser Baru"**
4. **Isi Form**:
   - Nama Panti Jompo
   - Lokasi
   - Deskripsi
   - Target Jumlah (MATIC)
   - Alamat Wallet Penerima
5. **Klik "Buat Fundraiser"**
6. **Approve Transaction** di MetaMask
7. **Tunggu Konfirmasi** - Transaction akan muncul di PolygonScan

## ⚠️ Troubleshooting

### Error: "Smart contract belum di-deploy"

**Solusi:**
1. Pastikan sudah deploy contract: `npm run deploy:amoy`
2. Check `.env` file - pastikan `VITE_FUNDRAISING_CONTRACT_ADDRESS` sudah di-set
3. Restart dev server setelah update `.env`
4. Hard refresh browser: `Ctrl+Shift+R`

### Error: "Transaction failed" atau "execution reverted"

**Kemungkinan penyebab:**
1. Contract address salah - check `.env` file
2. Network tidak sesuai - pastikan MetaMask di Polygon Amoy
3. Insufficient gas - pastikan wallet punya cukup MATIC
4. Contract belum di-deploy - deploy ulang contract

### Error: "User rejected"

**Solusi:**
- Approve transaction di popup MetaMask
- Pastikan MetaMask tidak di-lock
- Refresh halaman dan coba lagi

### Fundraiser tidak muncul setelah create

**Solusi:**
1. Tunggu beberapa detik (auto-refresh setiap 10 detik)
2. Refresh halaman manual
3. Check transaction di PolygonScan untuk memastikan berhasil
4. Check console untuk error messages

## 📋 Checklist Sebelum Create Fundraiser

- [ ] Smart contract sudah di-deploy
- [ ] Contract address sudah di-set di `.env`
- [ ] Dev server sudah di-restart setelah deploy
- [ ] Wallet sudah connected
- [ ] Network benar (Polygon Amoy untuk testnet)
- [ ] Wallet punya cukup MATIC untuk gas fee
- [ ] Semua field form sudah diisi dengan benar

## 🔍 Verifikasi Contract Deployed

Cara check apakah contract sudah di-deploy:

1. **Check `.env` file**:
   ```env
   VITE_FUNDRAISING_CONTRACT_ADDRESS=0x... (bukan 0x0000...)
   ```

2. **Check Browser Console**:
   - Buka Developer Tools (F12)
   - Lihat console untuk contract address
   - Tidak ada error "contract not deployed"

3. **Check Warning Banner**:
   - Jika ada banner kuning "Smart Contract Belum Dideploy" di atas, berarti belum di-deploy
   - Jika tidak ada banner, berarti sudah di-deploy

## 💡 Tips

- **Testnet MATIC**: Dapatkan dari [Polygon Faucet](https://faucet.polygon.technology/)
- **RPC URL**: Gunakan Infura atau Alchemy untuk RPC yang lebih reliable
- **Gas Fee**: Pastikan wallet punya minimal 0.01 MATIC untuk gas fee
- **Network**: Selalu pastikan MetaMask di network yang benar sebelum create fundraiser

## 📞 Masih Ada Masalah?

1. Check console untuk error messages
2. Check transaction di PolygonScan
3. Pastikan semua environment variables sudah di-set
4. Pastikan network di MetaMask sesuai dengan yang di `.env`
