# Checklist - Verifikasi Aplikasi Running Properly

## ✅ Pre-requisites

- [ ] **Contract Deployed**: Pastikan smart contract sudah di-deploy
  ```bash
  npm run deploy:mumbai
  # atau
  npm run deploy:polygon
  ```

- [ ] **Environment Variables**: Pastikan `.env` file sudah di-set
  ```env
  VITE_FUNDRAISING_CONTRACT_ADDRESS=0xYourContractAddress
  VITE_POLYGON_RPC_URL=https://your-rpc-url
  ```

- [ ] **MetaMask Installed**: Pastikan MetaMask extension sudah terinstall

- [ ] **Network Configuration**: Pastikan MetaMask connected ke network yang benar
  - Mumbai Testnet (Chain ID: 80001) untuk development
  - Polygon Mainnet (Chain ID: 137) untuk production

## ✅ Flow Testing

### 1. Connect Wallet
- [ ] Klik "Connect Wallet" button
- [ ] MetaMask popup muncul
- [ ] Approve connection
- [ ] Wallet address muncul di header
- [ ] Balance (MATIC) terlihat di header

### 2. Create Fundraiser
- [ ] Klik "Buat Fundraiser Baru" button (muncul setelah wallet connected)
- [ ] Form modal muncul
- [ ] Isi semua field:
  - [ ] Nama Panti Jompo
  - [ ] Lokasi
  - [ ] Deskripsi
  - [ ] Target Jumlah (MATIC)
  - [ ] Alamat Wallet Penerima
- [ ] Klik "Buat Fundraiser"
- [ ] MetaMask popup muncul untuk approve transaction
- [ ] Approve transaction
- [ ] Toast notification: "Fundraiser berhasil dibuat!"
- [ ] Modal tertutup
- [ ] Fundraiser baru muncul di list (setelah refresh)

### 3. View Fundraisers
- [ ] List fundraiser muncul di halaman
- [ ] Setiap fundraiser menampilkan:
  - [ ] Nama
  - [ ] Lokasi
  - [ ] Deskripsi
  - [ ] Progress bar (raised/target)
  - [ ] Button "Lihat & Donasi"

### 4. Donate
- [ ] Klik "Lihat & Donasi" pada fundraiser
- [ ] Donation modal muncul
- [ ] Masukkan jumlah donasi (MATIC)
- [ ] Klik "Donate MATIC"
- [ ] MetaMask popup muncul
- [ ] Approve transaction
- [ ] Toast notification: "Donasi berhasil!"
- [ ] Progress bar update
- [ ] Modal tertutup

## ✅ Error Handling

- [ ] **Contract Not Deployed**: Warning banner muncul jika contract address = 0x0
- [ ] **Wallet Not Connected**: Button create fundraiser tidak muncul
- [ ] **Transaction Rejected**: Error message muncul dengan jelas
- [ ] **Insufficient Funds**: Error message untuk gas fee
- [ ] **Wrong Network**: Warning banner muncul dengan button switch network

## ✅ Auto-Refresh

- [ ] Fundraiser list auto-refresh setiap 10 detik
- [ ] Fundraiser count auto-refresh setiap 5 detik
- [ ] Setelah create fundraiser baru, list update (via page refresh atau auto-refresh)

## 🔧 Troubleshooting

### Contract tidak muncul setelah deploy
1. Check `.env` file - pastikan `VITE_FUNDRAISING_CONTRACT_ADDRESS` sudah di-set
2. Restart dev server: `npm run dev`
3. Hard refresh browser: `Ctrl+Shift+R` (Windows) atau `Cmd+Shift+R` (Mac)

### Wallet tidak connect
1. Pastikan MetaMask extension aktif dan unlock
2. Refresh halaman
3. Check console untuk error messages
4. Pastikan network di MetaMask sesuai (Mumbai untuk testnet)

### Transaction gagal
1. Check balance MATIC untuk gas fee
2. Pastikan network benar
3. Check console untuk error details
4. Pastikan contract address benar di `.env`

### Fundraiser tidak muncul setelah create
1. Tunggu beberapa detik (auto-refresh setiap 10 detik)
2. Refresh halaman manual
3. Check console untuk error
4. Verify transaction di PolygonScan

## 📝 Notes

- Contract address harus di-set di `.env` sebelum aplikasi bisa digunakan
- Untuk development, gunakan Mumbai testnet
- Pastikan wallet punya cukup MATIC untuk gas fees
- Auto-refresh akan terus berjalan untuk update data terbaru dari blockchain
