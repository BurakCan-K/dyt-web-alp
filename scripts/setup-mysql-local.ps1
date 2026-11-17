# Requires MySQL root password once:
#   $env:MYSQL_ROOT_PASSWORD = 'kurulumdaki-root-sifren'
#   .\scripts\setup-mysql-local.ps1

$ErrorActionPreference = 'Stop'
$mysql = 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe'
if (-not (Test-Path $mysql)) {
  Write-Error "mysql.exe bulunamadı: $mysql"
}

if (-not $env:MYSQL_ROOT_PASSWORD) {
  Write-Host "MYSQL_ROOT_PASSWORD ortam değişkeni yok."
  Write-Host "Örnek:"
  Write-Host '  $env:MYSQL_ROOT_PASSWORD = ''kurulumdaki-root-sifren'''
  Write-Host '  .\scripts\setup-mysql-local.ps1'
  exit 1
}

$sql = Join-Path $PSScriptRoot 'mysql-init-local.sql'
Write-Host "DB + kullanıcı oluşturuluyor..."
& $mysql -u root "-p$env:MYSQL_ROOT_PASSWORD" -h 127.0.0.1 --default-character-set=utf8mb4 -e "source $sql"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "Bağlantı testi (dyt)..."
& $mysql -u dyt -pdyt_dev_only -h 127.0.0.1 -e "USE dyt_web_dev; SELECT DATABASE() AS db;"
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Write-Host "OK — şimdi: npm run db:migrate && npm run db:seed"
