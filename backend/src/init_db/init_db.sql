-- We allow "user" to connect to commonplace_dev_db for whatever IP docker assigns
CREATE DATABASE IF NOT EXISTS commonplace_dev_db;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON commonplace_dev_db.* TO 'user'@'%';

-- We allow "user" to connect to commonplace_test_db for whatever IP docker assigns
CREATE DATABASE IF NOT EXISTS commonplace_test_db;
CREATE USER IF NOT EXISTS 'user'@'%' IDENTIFIED BY 'password';
GRANT ALL PRIVILEGES ON commonplace_test_db.* TO 'user'@'%';

-- We haven't configured local SSL, so we'll use mysql_native_password instead of caching_sha2_password
ALTER USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY 'password';

FLUSH PRIVILEGES;
