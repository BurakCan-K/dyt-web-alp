-- Local MySQL setup for dyt-web (.env ile aynı)
CREATE DATABASE IF NOT EXISTS dyt_web_dev
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER IF NOT EXISTS 'dyt'@'localhost' IDENTIFIED BY 'dyt_dev_only';
CREATE USER IF NOT EXISTS 'dyt'@'127.0.0.1' IDENTIFIED BY 'dyt_dev_only';

-- Prisma migrate shadow DB için CREATE DATABASE gerekir
GRANT ALL PRIVILEGES ON *.* TO 'dyt'@'localhost' WITH GRANT OPTION;
GRANT ALL PRIVILEGES ON *.* TO 'dyt'@'127.0.0.1' WITH GRANT OPTION;
FLUSH PRIVILEGES;
