DROP DATABASE IF EXISTS db_transactions;
CREATE DATABASE db_transactions;
USE db_transactions;

CREATE TABLE users(
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    name_user VARCHAR(150) NOT NULL,
    identification_number VARCHAR(50) NOT NULL UNIQUE,
    phone VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    address VARCHAR(150) NOT NULL
);


CREATE TABLE transactions(
    id_transaction varchar(30) PRIMARY KEY,
    transaction_date varchar(20) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    transaction_states ENUM('pending', 'failed', 'completed') NOT NULL,
    transaction_type VARCHAR(50) NOT NULL,
    platform_name VARCHAR(50) NOT NULL,
    id_user INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES users(id_user)
);


CREATE TABLE invoice(
    id_invoice varchar(30) PRIMARY KEY,
    invoice_period varchar(30) NOT NULL,
    invoice_amount DECIMAL(10, 2) NOT NULL,
    amount_paid DECIMAL(10, 2) NOT NULL,
    id_transaction varchar(30) NOT NULL,
    FOREIGN KEY (id_transaction) REFERENCES transactions(id_transaction)
);

select * from users;
select * from transactions;
select * from invoice;