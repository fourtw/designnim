# Troubleshooting: Port 8545 Already in Use

## 🔍 Masalah

Ketika menjalankan `npm run node`, muncul error bahwa port 8545 sudah digunakan.

## 🎯 Solusi

### Solusi 1: Kill Process yang Menggunakan Port 8545

Saya sudah membuat script untuk kill process:

```bash
npm run node:kill
```

Script ini akan:
- ✅ Mencari process yang menggunakan port 8545
- ✅ Kill process tersebut
- ✅ Memberikan konfirmasi

### Solusi 2: Manual Kill Process

#### Windows PowerShell

1. **Cari process yang menggunakan port 8545:**
   ```powershell
   netstat -ano | findstr :8545
   ```
   
   Output akan menampilkan PID (Process ID), contoh:
   ```
   TCP    0.0.0.0:8545           0.0.0.0:0              LISTENING       12345
   ```

2. **Kill process:**
   ```powershell
   taskkill /PID 12345 /F
   ```
   (Ganti 12345 dengan PID yang ditemukan)

#### Atau gunakan PowerShell command:

```powershell
Get-Process -Id (Get-NetTCPConnection -LocalPort 8545).OwningProcess | Stop-Process -Force
```

### Solusi 3: Gunakan Port Lain

Jika port 8545 memang digunakan aplikasi lain, bisa ubah ke port lain:

1. **Edit `hardhat.config.cjs`:**
   ```javascript
   localhost: {
     url: 'http://127.0.0.1:8546', // Ubah ke port lain
     chainId: 1337,
     accounts: undefined,
   },
   ```

2. **Edit `.env`:**
   ```env
   VITE_POLYGON_RPC_URL=http://127.0.0.1:8546
   ```

3. **Update MetaMask network:**
   - RPC URL: `http://127.0.0.1:8546`

### Solusi 4: Restart Terminal/VS Code

Kadang process masih running di background:
1. Close semua terminal
2. Restart VS Code
3. Coba `npm run node` lagi

## 🔍 Check Port Status

### Check apakah port digunakan:

```powershell
# PowerShell
Get-NetTCPConnection -LocalPort 8545 -ErrorAction SilentlyContinue

# Atau
netstat -ano | findstr :8545
```

### Check process Hardhat node:

```powershell
Get-Process | Where-Object {$_.ProcessName -like "*node*" -or $_.ProcessName -like "*hardhat*"}
```

## 💡 Tips

1. **Selalu kill process sebelum start baru:**
   ```bash
   npm run node:kill
   npm run node
   ```

2. **Check terminal yang sudah running:**
   - Hardhat node biasanya running di terminal terpisah
   - Check semua terminal windows
   - Stop dengan `Ctrl+C` di terminal tersebut

3. **Gunakan script helper:**
   - `npm run node:kill` - kill process di port 8545
   - `npm run node` - start Hardhat node

## 🚨 Jika Masih Error

1. **Check apakah Hardhat node sudah running:**
   - Buka terminal lain
   - Coba connect: `curl http://127.0.0.1:8545`
   - Jika ada response, berarti node sudah running

2. **Restart komputer:**
   - Jika semua cara tidak berhasil
   - Restart akan kill semua process

3. **Gunakan port lain:**
   - Ubah ke port 8546, 8547, dll
   - Update semua konfigurasi

## 📋 Quick Commands

```bash
# Kill process di port 8545
npm run node:kill

# Start Hardhat node
npm run node

# Check port status
netstat -ano | findstr :8545
```
