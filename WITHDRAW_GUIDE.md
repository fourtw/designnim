# Panduan Penarikan Dana (Withdraw)

## 📋 Ringkasan

Penarikan dana dari fundraiser hanya bisa dilakukan oleh **owner fundraiser** (yang membuat fundraiser tersebut). Dana akan dikirim ke **recipient address** yang ditentukan saat membuat fundraiser.

## 🔑 Account yang Digunakan untuk Withdraw

### Account untuk Menjalankan Withdraw
- **Account yang membuat fundraiser** (fundraiser owner)
- Account ini adalah wallet yang digunakan saat memanggil fungsi `createFundraiser()`
- Hanya account ini yang bisa memanggil fungsi `withdrawFunds()`

### Account Penerima Dana
- **Recipient address** yang ditentukan saat membuat fundraiser
- Alamat ini diisi di field "Alamat Wallet Penerima" saat membuat fundraiser
- Dana akan dikirim ke alamat ini setelah withdraw berhasil

## 📝 Cara Melakukan Withdraw

### 1. Pastikan Anda adalah Owner Fundraiser

1. **Buat fundraiser** dengan wallet Anda
   - Pastikan wallet Anda terhubung saat membuat fundraiser
   - Wallet ini akan menjadi "owner" dari fundraiser

2. **Verifikasi ownership**
   - Buka fundraiser yang Anda buat
   - Jika Anda adalah owner, akan muncul badge "Anda adalah Owner Fundraiser ini"
   - Tombol "Tarik" akan muncul jika ada dana yang terkumpul

### 2. Pastikan Ada Dana yang Bisa Ditarik

- Fundraiser harus memiliki `raisedAmount > 0` (ada donasi yang masuk)
- Fundraiser harus dalam status `isActive = true`

### 3. Lakukan Withdraw

1. **Buka fundraiser** yang Anda buat
   - Klik "Lihat & Donasi" pada fundraiser card

2. **Klik tombol "Tarik"**
   - Tombol ini hanya muncul jika:
     - Anda adalah owner fundraiser
     - Ada dana yang terkumpul (`raisedAmount > 0`)

3. **Approve transaction** di MetaMask
   - Pastikan wallet yang digunakan adalah wallet owner
   - Approve transaction untuk menarik dana

4. **Tunggu konfirmasi**
   - Transaction akan diproses di blockchain
   - Setelah berhasil, dana akan dikirim ke recipient address

## ⚠️ Penting untuk Diingat

### 1. Owner vs Recipient
- **Owner**: Wallet yang membuat fundraiser (bisa withdraw)
- **Recipient**: Wallet yang menerima dana (ditentukan saat create)

**Contoh:**
```
Owner: 0x123... (wallet Anda saat create fundraiser)
Recipient: 0x456... (wallet panti jompo yang akan terima dana)
```

### 2. Siapa yang Bisa Withdraw?
- ✅ **Hanya owner fundraiser** yang bisa withdraw
- ❌ Donor tidak bisa withdraw
- ❌ Admin contract tidak bisa withdraw (kecuali jika admin adalah owner)

### 3. Ke Mana Dana Dikirim?
- Dana dikirim ke **recipient address** yang ditentukan saat create fundraiser
- **Bukan** ke owner address
- Pastikan recipient address benar saat membuat fundraiser!

### 4. Setelah Withdraw
- `raisedAmount` akan di-reset menjadi 0
- Fundraiser tetap aktif (bisa menerima donasi lagi)
- Transaction akan tercatat di blockchain explorer

## 🧪 Testing di Local Network

### Setup untuk Testing Withdraw

1. **Gunakan 2 wallet berbeda:**
   - **Wallet A** (Account #1): Untuk create fundraiser
   - **Wallet B** (Account #2): Untuk donasi
   - **Wallet C** (Account #3): Sebagai recipient address

2. **Import wallets ke MetaMask:**
   ```bash
   npm run accounts
   ```
   Copy private keys dan import ke MetaMask

3. **Create fundraiser dengan Wallet A:**
   - Connect Wallet A
   - Buat fundraiser baru
   - Set recipient address = Wallet C address

4. **Donasi dengan Wallet B:**
   - Connect Wallet B
   - Donasi ke fundraiser yang dibuat Wallet A

5. **Withdraw dengan Wallet A:**
   - Connect Wallet A (owner)
   - Buka fundraiser
   - Klik tombol "Tarik"
   - Approve transaction
   - Dana akan dikirim ke Wallet C (recipient)

### Verifikasi Hasil

1. **Check recipient wallet balance:**
   - Buka Wallet C di MetaMask
   - Balance harus bertambah sesuai jumlah yang ditarik

2. **Check fundraiser:**
   - `raisedAmount` harus menjadi 0
   - Fundraiser masih aktif (bisa terima donasi lagi)

3. **Check transaction:**
   - Klik link "Lihat transaksi di explorer"
   - Verifikasi di blockchain explorer

## 🔍 Troubleshooting

### Error: "Only fundraiser owner can call this"
**Penyebab:** Wallet yang digunakan bukan owner fundraiser

**Solusi:**
- Pastikan menggunakan wallet yang sama dengan saat create fundraiser
- Check di MetaMask, pastikan wallet yang connected adalah owner

### Error: "No funds to withdraw"
**Penyebab:** Tidak ada dana yang terkumpul (`raisedAmount = 0`)

**Solusi:**
- Pastikan ada donasi yang masuk ke fundraiser
- Check `raisedAmount` di fundraiser details

### Error: "Fundraiser is not active"
**Penyebab:** Fundraiser sudah di-nonaktifkan

**Solusi:**
- Owner bisa mengaktifkan kembali dengan `toggleFundraiserStatus()`
- Atau buat fundraiser baru

### Transaction stuck atau pending
**Penyebab:** Network issue atau gas fee terlalu rendah

**Solusi:**
- Pastikan network benar (Hardhat Local untuk testing)
- Pastikan wallet punya cukup ETH untuk gas fee
- Coba refresh dan ulangi

## 📊 Flow Diagram

```
1. Create Fundraiser
   └─> Owner: Wallet A
   └─> Recipient: Wallet C

2. Donations
   └─> Donor 1 (Wallet B) donates 1 MATIC
   └─> Donor 2 (Wallet D) donates 2 MATIC
   └─> raisedAmount = 3 MATIC

3. Withdraw (by Owner)
   └─> Owner (Wallet A) calls withdrawFunds()
   └─> Contract sends 3 MATIC to Recipient (Wallet C)
   └─> raisedAmount = 0

4. Result
   └─> Wallet C balance +3 MATIC
   └─> Fundraiser still active (can receive more donations)
```

## 💡 Tips

1. **Gunakan recipient address yang berbeda dari owner:**
   - Lebih aman dan transparan
   - Memisahkan wallet operasional dengan wallet penerima dana

2. **Verifikasi recipient address sebelum create:**
   - Pastikan address benar (copy-paste dengan hati-hati)
   - Test dengan amount kecil dulu

3. **Monitor fundraiser:**
   - Check `raisedAmount` secara berkala
   - Withdraw saat sudah cukup atau sesuai kebutuhan

4. **Dokumentasi:**
   - Simpan transaction hash untuk audit
   - Catat recipient address untuk referensi

## 🔗 Referensi

- Smart Contract: `contracts/Fundraising.sol` - fungsi `withdrawFunds()`
- Hook: `src/hooks/useFundraising.ts` - fungsi `withdrawFunds()`
- UI: `src/components/DonationModal.tsx` - tombol withdraw

