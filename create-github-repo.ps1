# Script untuk membuat GitHub repository
# Penggunaan: .\create-github-repo.ps1 -Token "your_github_token"

param(
    [Parameter(Mandatory=$false)]
    [string]$Token,
    
    [Parameter(Mandatory=$false)]
    [string]$RepoName = "designnim"
)

if (-not $Token) {
    Write-Host "Untuk membuat repository GitHub, Anda memerlukan Personal Access Token." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Cara mendapatkan token:" -ForegroundColor Cyan
    Write-Host "1. Buka https://github.com/settings/tokens" -ForegroundColor White
    Write-Host "2. Klik 'Generate new token (classic)'" -ForegroundColor White
    Write-Host "3. Beri nama token (misalnya: 'designnim-repo')" -ForegroundColor White
    Write-Host "4. Pilih scope: 'repo' (full control)" -ForegroundColor White
    Write-Host "5. Klik 'Generate token' dan copy token yang diberikan" -ForegroundColor White
    Write-Host ""
    Write-Host "Atau buat repository secara manual:" -ForegroundColor Cyan
    Write-Host "1. Buka https://github.com/new" -ForegroundColor White
    Write-Host "2. Repository name: $RepoName" -ForegroundColor White
    Write-Host "3. Pilih Public atau Private" -ForegroundColor White
    Write-Host "4. JANGAN centang 'Initialize with README'" -ForegroundColor White
    Write-Host "5. Klik 'Create repository'" -ForegroundColor White
    Write-Host ""
    Write-Host "Setelah repo dibuat, jalankan:" -ForegroundColor Cyan
    Write-Host "  git remote add origin https://github.com/USERNAME/$RepoName.git" -ForegroundColor White
    Write-Host "  git branch -M main" -ForegroundColor White
    Write-Host "  git push -u origin main" -ForegroundColor White
    exit
}

try {
    $headers = @{
        'Accept' = 'application/vnd.github.v3+json'
        'Authorization' = "token $Token"
    }
    
    $body = @{
        name = $RepoName
        private = $false
        description = "DesignNim Project"
        auto_init = $false
    } | ConvertTo-Json
    
    Write-Host "Membuat repository '$RepoName' di GitHub..." -ForegroundColor Cyan
    
    $response = Invoke-RestMethod -Uri 'https://api.github.com/user/repos' -Method Post -Headers $headers -Body $body
    
    Write-Host "Repository berhasil dibuat!" -ForegroundColor Green
    Write-Host "URL: $($response.html_url)" -ForegroundColor Green
    Write-Host ""
    Write-Host "Menambahkan remote origin..." -ForegroundColor Cyan
    
    $username = $response.owner.login
    git remote add origin "https://github.com/$username/$RepoName.git"
    
    Write-Host "Remote origin berhasil ditambahkan!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Langkah selanjutnya:" -ForegroundColor Cyan
    Write-Host "1. git add ." -ForegroundColor White
    Write-Host "2. git commit -m 'Initial commit'" -ForegroundColor White
    Write-Host "3. git branch -M main" -ForegroundColor White
    Write-Host "4. git push -u origin main" -ForegroundColor White
    
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "Response: $responseBody" -ForegroundColor Red
    }
}
