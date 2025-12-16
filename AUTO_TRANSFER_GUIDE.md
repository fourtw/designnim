# Panduan Auto-Transfer ke Recipient

## 🎯 Fitur Auto-Transfer

Smart contract sekarang memiliki fitur **auto-transfer** yang akan secara otomatis mengirimkan dana ke recipient address ketika target fundraising tercapai.

## 🔄 Cara Kerja

### Flow Auto-Transfer

1. **Donor melakukan donasi** ke fundraiser
2. **Smart contract menambahkan** donasi ke `raisedAmount`
3. **Smart contract mengecek** apakah `raisedAmount >= targetAmount`
4. **Jika target tercapai:**
   - Dana otomatis dikirim ke `recipient` address
   - `raisedAmount` di-reset menjadi 0
   - Event `FundsWithdrawn` di-emit
   - Fundraiser tetap aktif (bisa terima donasi lagi)

### Contoh Skenario

```
Target: 10 MATIC
Raised: 9 MATIC

Donor donasi: 1 MATIC
├─> raisedAmount = 10 MATIC
├─> Check: 10 >= 10? ✅ YES
├─> Auto-transfer 10 MATIC ke recipient
├─> raisedAmount = 0
└─> Fundraiser masih aktif (bisa terima donasi lagi)
```

## 📋 Setup untuk Testing

### 1. Siapkan Wallets

Jalankan untuk melihat accounts:
```bash
npm run accounts
```

**Rekomendasi setup:**
- **Account #1** (Owner): Untuk create fundraiser
- **Account #2** (Donor): Untuk donasi
- **Account #3** (Recipient): Sebagai penerima dana (recipient address)

### 2. Import Wallets ke MetaMask

1. Copy private keys dari output `npm run accounts`
2. Import ke MetaMask:
   - Account #1 → Owner wallet
   - Account #2 → Donor wallet  
   - Account #3 → Recipient wallet (untuk verifikasi penerimaan)

### 3. Create Fundraiser dengan Account #1

1. **Connect Account #1** di aplikasi
2. **Klik "Buat Fundraiser Baru"**
3. **Isi form:**
   - Nama: "Test Auto-Transfer"
   - Lokasi: "Jakarta"
   - Deskripsi: "Testing auto-transfer feature"
   - **Target: 5 MATIC** (jumlah kecil untuk testing)
   - **Alamat Penerima: Account #3 address** (copy dari `npm run accounts`)

4. **Submit** dan approve transaction

### 4. Test Auto-Transfer

#### Skenario 1: Donasi yang mencapai target

1. **Connect Account #2** (Donor)
2. **Buka fundraiser** yang dibuat Account #1
3. **Donasi 5 MATIC** (sama dengan target)
4. **Approve transaction**
5. **Hasil:**
   - ✅ Donasi berhasil
   - ✅ Auto-transfer otomatis terjadi
   - ✅ Account #3 balance bertambah 5 MATIC
   - ✅ `raisedAmount` menjadi 0

#### Skenario 2: Donasi yang melebihi target

1. **Connect Account #2** (Donor)
2. **Donasi 3 MATIC** (fundraiser sudah ada 2 MATIC, target 5 MATIC)
3. **Hasil:**
   - ✅ Donasi 3 MATIC berhasil
   - ✅ `raisedAmount` = 5 MATIC (mencapai target)
   - ✅ Auto-transfer 5 MATIC ke Account #3
   - ✅ `raisedAmount` = 0

#### Skenario 3: Multiple donations sampai target

1. **Donor 1** donasi 2 MATIC
   - `raisedAmount` = 2 MATIC (belum target)

2. **Donor 2** donasi 2 MATIC
   - `raisedAmount` = 4 MATIC (belum target)

3. **Donor 3** donasi 1 MATIC
   - `raisedAmount` = 5 MATIC (target tercapai!)
   - ✅ Auto-transfer 5 MATIC ke Account #3
   - ✅ `raisedAmount` = 0

## 🔍 Verifikasi Auto-Transfer

### 1. Check Recipient Balance

1. **Buka MetaMask**
2. **Switch ke Account #3** (Recipient)
3. **Check balance** - harus bertambah sesuai jumlah yang ditransfer

### 2. Check Fundraiser Status

1. **Buka fundraiser** di aplikasi
2. **Check `raisedAmount`** - harus menjadi 0 setelah auto-transfer
3. **Fundraiser masih aktif** - bisa terima donasi lagi

### 3. Check Transaction

1. **Klik link "Lihat transaksi di explorer"** setelah donasi
2. **Check events:**
   - `DonationMade` - donasi berhasil
   - `FundsWithdrawn` - auto-transfer terjadi
3. **Check recipient transaction** - ada transfer masuk

## ⚠️ Penting untuk Diingat

### 1. Auto-Transfer vs Manual Withdraw

- **Auto-Transfer**: Terjadi otomatis saat target tercapai
- **Manual Withdraw**: Owner masih bisa withdraw kapan saja (jika belum target)

### 2. Recipient Address

- **Pastikan recipient address benar** saat create fundraiser
- **Recipient tidak bisa diubah** setelah fundraiser dibuat
- **Dana akan dikirim ke recipient** saat target tercapai

### 3. Multiple Auto-Transfers

- Jika fundraiser masih aktif setelah auto-transfer
- Donasi berikutnya akan menambah `raisedAmount` lagi
- Jika target tercapai lagi, akan auto-transfer lagi

### 4. Gas Fees

- **Donor membayar gas** untuk donasi
- **Auto-transfer termasuk dalam gas** donasi transaction
- Tidak ada biaya tambahan untuk auto-transfer

## 🧪 Testing Checklist

- [ ] Account #3 di-set sebagai recipient address
- [ ] Fundraiser dibuat dengan target yang reasonable (misal 5 MATIC)
- [ ] Donasi dilakukan sampai target tercapai
- [ ] Auto-transfer terjadi otomatis
- [ ] Account #3 balance bertambah
- [ ] `raisedAmount` menjadi 0
- [ ] Fundraiser masih aktif
- [ ] Event `FundsWithdrawn` tercatat di blockchain

## 🔧 Troubleshooting

### Auto-transfer tidak terjadi

**Kemungkinan penyebab:**
1. Target belum tercapai (`raisedAmount < targetAmount`)
2. Fundraiser tidak aktif (`isActive = false`)
3. Transaction gagal

**Solusi:**
- Check `raisedAmount` dan `targetAmount` di fundraiser
- Pastikan fundraiser masih aktif
- Check transaction di blockchain explorer

### Recipient tidak menerima dana

**Kemungkinan penyebab:**
1. Recipient address salah
2. Transaction gagal
3. Network berbeda

**Solusi:**
- Verifikasi recipient address di fundraiser
- Check transaction status di explorer
- Pastikan recipient wallet di network yang sama

### raisedAmount tidak reset

**Kemungkinan penyebab:**
1. Auto-transfer belum terjadi
2. Transaction masih pending

**Solusi:**
- Tunggu konfirmasi transaction
- Check event `FundsWithdrawn` di explorer
- Refresh aplikasi

## 📊 Flow Diagram

```
Donor donates
    │
    ├─> Add to raisedAmount
    │
    ├─> Check: raisedAmount >= targetAmount?
    │   │
    │   ├─> NO: Stop (fundraiser continues)
    │   │
    │   └─> YES: Auto-transfer
    │       │
    │       ├─> Transfer to recipient
    │       ├─> Reset raisedAmount = 0
    │       ├─> Emit FundsWithdrawn event
    │       └─> Fundraiser still active
    │
    └─> Emit DonationMade event
```

## 💡 Tips

1. **Test dengan target kecil dulu** (misal 1-5 MATIC) untuk memastikan auto-transfer bekerja
2. **Monitor recipient wallet** untuk verifikasi penerimaan
3. **Check events di explorer** untuk audit trail
4. **Gunakan account berbeda** untuk owner, donor, dan recipient untuk testing yang jelas

## 🔗 Referensi

- Smart Contract: `contracts/Fundraising.sol` - fungsi `donate()`
- Event: `FundsWithdrawn` - emitted saat auto-transfer
- Frontend: `src/components/DonationModal.tsx` - menampilkan donasi

