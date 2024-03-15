CREATE DATABASE IF NOT EXISTS commonplace_dev_db;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON commonplace_dev_db.* TO 'user'@'%';
FLUSH PRIVILEGES;
