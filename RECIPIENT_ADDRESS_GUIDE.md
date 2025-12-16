# Panduan: Alamat Penerima (Recipient Address)

## ⚠️ Masalah Umum: Owner = Recipient

**Masalah:** Ketika membuat fundraiser, jika owner dan recipient adalah address yang sama, dana akan kembali ke wallet owner, bukan ke panti jompo.

### Contoh Masalah

```
Owner: 0x7099... (Account #2 - yang membuat fundraiser)
Recipient: 0x7099... (Account #2 - SAMA dengan owner) ❌

Hasil: Dana dikirim kembali ke Account #2, bukan ke Account #3
```

### Solusi

**Gunakan Account #3 sebagai recipient address:**

```
Owner: 0x7099... (Account #2 - yang membuat fundraiser)
Recipient: 0x3C44... (Account #3 - penerima dana) ✅

Hasil: Dana dikirim ke Account #3 (panti jompo)
```

## 📋 Cara Setup yang Benar

### 1. Dapatkan Account Addresses

Jalankan untuk melihat semua accounts:

```bash
npm run accounts
```

Output akan menampilkan:
- **Account #1**: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266` (Owner - untuk create fundraiser)
- **Account #2**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8` (Donor)
- **Account #3**: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC` (Recipient - panti jompo) ⭐

### 2. Import Wallets ke MetaMask

1. **Account #1** → Import ke MetaMask (untuk create fundraiser)
2. **Account #2** → Import ke MetaMask (untuk donasi)
3. **Account #3** → Import ke MetaMask (untuk verifikasi penerimaan dana)

### 3. Create Fundraiser dengan Recipient yang Benar

1. **Connect Account #1** di aplikasi
2. **Klik "Buat Fundraiser Baru"**
3. **Isi form:**
   - Nama: "Panti Jompo ABC"
   - Lokasi: "Jakarta"
   - Deskripsi: "Kampanye untuk panti jompo"
   - Target: 10 MATIC
   - **Recipient: `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`** (Account #3) ⭐

4. **Klik tombol "Copy Account #3"** di form untuk mudah copy address

5. **Submit** dan approve transaction

### 4. Verifikasi Setup

Jalankan untuk check fundraiser:

```bash
npm run check
```

Pastikan:
- ✅ Owner ≠ Recipient
- ✅ Recipient = Account #3 address
- ✅ `raisedAmount` = 0 (belum ada donasi)

## 🔍 Fitur Validasi yang Ditambahkan

### 1. Real-time Warning

Form akan menampilkan warning jika recipient = owner:
```
⚠️ Peringatan: Alamat penerima sama dengan owner. 
Dana akan kembali ke wallet Anda, bukan ke panti jompo!
```

### 2. Validation Error

Form tidak akan bisa di-submit jika recipient = owner:
```
❌ Alamat penerima tidak boleh sama dengan alamat owner (wallet Anda)
```

### 3. Helper Button

Tombol "Copy Account #3" untuk mudah copy recipient address.

## 📊 Flow yang Benar

```
1. Account #1 (Owner) creates fundraiser
   └─> Recipient: Account #3 address

2. Account #2 (Donor) donates
   └─> Funds go to contract

3. Auto-transfer atau Manual withdraw
   └─> Funds sent to Account #3 (Recipient) ✅

4. Account #3 receives funds
   └─> Balance increases ✅
```

## 🧪 Testing Checklist

- [ ] Account #1 connected (owner)
- [ ] Recipient address = Account #3 (bukan Account #1)
- [ ] Form tidak menampilkan warning
- [ ] Form bisa di-submit tanpa error
- [ ] Fundraiser created dengan recipient yang benar
- [ ] `npm run check` menunjukkan Owner ≠ Recipient
- [ ] Test donasi dan verifikasi dana masuk ke Account #3

## ⚠️ Troubleshooting

### Error: "Alamat penerima tidak boleh sama dengan owner"

**Penyebab:** Recipient address sama dengan owner address

**Solusi:**
- Gunakan Account #3 address sebagai recipient
- Klik "Copy Account #3" di form
- Paste ke field recipient

### Warning muncul tapi form bisa di-submit

**Penyebab:** Validasi belum sempurna

**Solusi:**
- Form sekarang akan **block submit** jika recipient = owner
- Pastikan recipient ≠ owner sebelum submit

### Dana masih masuk ke owner wallet

**Penyebab:** Fundraiser lama masih menggunakan recipient = owner

**Solusi:**
- Buat fundraiser baru dengan recipient yang benar
- Fundraiser lama tidak bisa diubah recipient address

## 💡 Tips

1. **Selalu gunakan Account #3 sebagai recipient:**
   - Ini adalah wallet untuk panti jompo
   - Dana akan masuk ke wallet ini

2. **Verifikasi sebelum submit:**
   - Check recipient address ≠ owner address
   - Pastikan format address benar (0x...)

3. **Gunakan tombol "Copy Account #3":**
   - Memudahkan copy address
   - Mengurangi kesalahan copy-paste

4. **Check setelah create:**
   - Jalankan `npm run check`
   - Verifikasi Owner ≠ Recipient

## 🔗 Referensi

- Account addresses: `npm run accounts`
- Check fundraiser: `npm run check`
- Form component: `src/components/CreateFundraiserForm.tsx`

