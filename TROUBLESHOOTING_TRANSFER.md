# Troubleshooting: Dana Tidak Muncul di Wallet Penerima

## 🔍 Masalah yang Terjadi

Ketika withdraw atau auto-withdraw dilakukan, dana tidak muncul di wallet penerima (Account #3).

## 🎯 Kemungkinan Penyebab

### 1. Contract Belum Di-Re-Deploy

**Gejala:**
- Transaksi "Withdraw Funds" menunjukkan "-0 ETH"
- `raisedAmount` sudah 0 sebelum withdraw
- Auto-transfer tidak terjadi saat target tercapai

**Solusi:**
1. **Re-compile contract:**
   ```bash
   npm run compile
   ```

2. **Re-deploy contract:**
   ```bash
   npm run deploy:local
   ```
   (Pastikan Hardhat node masih running: `npm run node`)

3. **Update `.env`:**
   - Contract address baru akan otomatis di-update
   - Restart dev server: `npm run dev`

### 2. Contract Address Tidak Sesuai

**Gejala:**
- Frontend menggunakan contract address lama
- Transaction berhasil tapi tidak mempengaruhi contract yang benar

**Solusi:**
1. **Check `.env` file:**
   ```env
   VITE_FUNDRAISING_CONTRACT_ADDRESS=0x...
   ```

2. **Verifikasi contract address:**
   - Pastikan address di `.env` sama dengan yang di-deploy
   - Check di output `npm run deploy:local`

3. **Restart dev server** setelah update `.env`

### 3. raisedAmount Sudah 0

**Gejala:**
- `raisedAmount` = 0 saat withdraw dipanggil
- Auto-transfer sudah terjadi sebelumnya
- Tidak ada dana untuk di-withdraw

**Solusi:**
1. **Check fundraiser status:**
   - Buka fundraiser di aplikasi
   - Check `raisedAmount` - harus > 0 untuk withdraw

2. **Jika auto-transfer sudah terjadi:**
   - Dana sudah dikirim ke recipient
   - Check recipient wallet (Account #3) balance
   - Fundraiser bisa terima donasi lagi

### 4. Recipient Address Salah

**Gejala:**
- Dana ditransfer tapi ke address yang salah
- Recipient tidak menerima dana

**Solusi:**
1. **Verifikasi recipient address:**
   - Check di fundraiser details
   - Pastikan sama dengan Account #3 address

2. **Check transaction di explorer:**
   - Klik "Lihat transaksi di explorer"
   - Check `to` address di transaction details
   - Pastikan sesuai dengan recipient address

## 🧪 Testing Step-by-Step

### Test 1: Verifikasi Contract Ter-Deploy

1. **Check contract address:**
   ```bash
   type .env | findstr FUNDRAISING
   ```

2. **Check contract di Hardhat console:**
   ```bash
   npx hardhat console --network localhost
   ```
   ```javascript
   const Fundraising = await ethers.getContractFactory("Fundraising");
   const contract = await Fundraising.attach("YOUR_CONTRACT_ADDRESS");
   const nextId = await contract.getNextFundraiserId();
   console.log("Next ID:", nextId.toString());
   ```

### Test 2: Verifikasi Fundraiser Ada Dana

1. **Check fundraiser di contract:**
   ```javascript
   const fundraiser = await contract.getFundraiser(1);
   console.log("Raised Amount:", ethers.formatEther(fundraiser.raisedAmount));
   console.log("Target Amount:", ethers.formatEther(fundraiser.targetAmount));
   console.log("Recipient:", fundraiser.recipient);
   ```

2. **Pastikan:**
   - `raisedAmount > 0` untuk manual withdraw
   - `raisedAmount >= targetAmount` untuk auto-transfer

### Test 3: Test Transfer Langsung

1. **Test transfer dari contract ke recipient:**
   ```javascript
   const recipient = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"; // Account #3
   const [signer] = await ethers.getSigners();
   const balanceBefore = await ethers.provider.getBalance(recipient);
   console.log("Balance before:", ethers.formatEther(balanceBefore));
   
   // Test withdraw
   await contract.withdrawFunds(1);
   
   const balanceAfter = await ethers.provider.getBalance(recipient);
   console.log("Balance after:", ethers.formatEther(balanceAfter));
   console.log("Difference:", ethers.formatEther(balanceAfter - balanceBefore));
   ```

## 🔧 Fix yang Perlu Dilakukan

### 1. Pastikan Contract Ter-Deploy dengan Versi Terbaru

```bash
# 1. Stop Hardhat node (Ctrl+C)
# 2. Start lagi
npm run node

# 3. Di terminal lain, deploy ulang
npm run deploy:local

# 4. Copy contract address baru
# 5. Update .env (otomatis oleh script)
# 6. Restart dev server
npm run dev
```

### 2. Verifikasi Recipient Address

1. **Dapatkan Account #3 address:**
   ```bash
   npm run accounts
   ```
   - Copy Account #3 address

2. **Gunakan address tersebut saat create fundraiser:**
   - Pastikan copy-paste dengan benar
   - Verifikasi di fundraiser details setelah create

### 3. Test dengan Skenario Lengkap

1. **Setup:**
   - Account #1: Create fundraiser dengan recipient = Account #3
   - Account #2: Donor
   - Account #3: Recipient (check balance)

2. **Test Auto-Transfer:**
   - Donasi sampai target tercapai
   - Check Account #3 balance (harus bertambah)

3. **Test Manual Withdraw:**
   - Donasi (tapi belum target)
   - Owner withdraw manual
   - Check Account #3 balance (harus bertambah)

## 📊 Debug Checklist

- [ ] Contract sudah di-compile (`npm run compile`)
- [ ] Contract sudah di-deploy ulang (`npm run deploy:local`)
- [ ] Contract address di `.env` sesuai dengan yang ter-deploy
- [ ] Dev server sudah di-restart setelah update `.env`
- [ ] Hardhat node masih running
- [ ] Recipient address benar (Account #3)
- [ ] `raisedAmount > 0` sebelum withdraw
- [ ] Network di MetaMask = Hardhat Local (Chain ID: 1337)
- [ ] Transaction confirmed di blockchain
- [ ] Check transaction details di explorer

## 🔍 Cara Check Transaction Details

1. **Klik "Lihat transaksi di explorer"** setelah transaction
2. **Check:**
   - Transaction status: Success
   - `to` address: Contract address
   - Events: `FundsWithdrawn` dengan amount yang benar
   - Internal transactions: Transfer ke recipient address

3. **Jika ada internal transaction:**
   - Check `to` address = recipient address
   - Check amount = `raisedAmount`

## 💡 Tips

1. **Selalu re-deploy setelah ubah contract:**
   - Contract yang ter-deploy tidak otomatis update
   - Harus deploy ulang dengan address baru

2. **Verifikasi recipient address:**
   - Double-check saat create fundraiser
   - Test dengan amount kecil dulu

3. **Monitor transaction events:**
   - Check `FundsWithdrawn` event
   - Verify amount dan recipient address

4. **Check balance recipient:**
   - Refresh MetaMask setelah transaction
   - Check di Account #3 wallet

## 🚨 Jika Masih Tidak Berfungsi

1. **Check contract code:**
   - Pastikan logic transfer benar
   - Pastikan tidak ada bug di smart contract

2. **Check transaction logs:**
   - Buka Hardhat node terminal
   - Check untuk error messages

3. **Test dengan Hardhat console:**
   - Test transfer langsung dari console
   - Verify contract state

4. **Reset dan test ulang:**
   - Stop Hardhat node
   - Start ulang (reset state)
   - Deploy contract baru
   - Test dari awal
