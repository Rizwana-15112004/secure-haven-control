-- Secure Haven Control - Database Schema
-- Compatible with MySQL 8.0+
-- Use this script in SQLyog to set up your project database.

CREATE DATABASE IF NOT EXISTS secure_haven;
USE secure_haven;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role ENUM('ADMIN', 'VOLUNTEER', 'DONOR') DEFAULT 'VOLUNTEER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Donors table for blood donation tracking
CREATE TABLE IF NOT EXISTS donors (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    blood_type VARCHAR(5) NOT NULL,
    last_donation_date DATE,
    contact_number VARCHAR(15),
    location VARCHAR(255),
    is_eligible BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Alerts table for emergency tracking
CREATE TABLE IF NOT EXISTS alerts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(20) DEFAULT 'EMERGENCY',
    severity VARCHAR(10) DEFAULT 'HIGH',
    latitude DOUBLE,
    longitude DOUBLE,
    triggered_by BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (triggered_by) REFERENCES users(id)
);

-- Responses table for alert tracking
CREATE TABLE IF NOT EXISTS alert_responses (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    alert_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    status ENUM('PENDING', 'ACCEPTED', 'REJECTED', 'COMPLETED') DEFAULT 'PENDING',
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (alert_id) REFERENCES alerts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Initial Accounts (User: admin / Pass: admin123) and (User: staff / Pass: staff123)
INSERT IGNORE INTO users (username, password, full_name, role) 
VALUES 
('admin', 'admin123', 'System Administrator', 'ADMIN'),
('staff', 'staff123', 'Rescue Staff', 'VOLUNTEER');

-- Sample Data for testing
INSERT IGNORE INTO donors (name, blood_type, last_donation_date, contact_number, location)
VALUES 
('John Doe', 'O+', '2023-10-15', '1234567890', 'New York'),
('Jane Smith', 'A-', '2023-11-20', '0987654321', 'Los Angeles');
