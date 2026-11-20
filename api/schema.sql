-- ========================================================
-- Apokrin Enterprise — Database Schema for Contact & Inquiries
-- Character Set: utf8mb4 (supports emojis, international names)
-- ========================================================

CREATE DATABASE IF NOT EXISTS `apokrintest_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `apokrintest_db`;

-- 1. Table for Contact Form Submissions (Leads / Enquiries)
CREATE TABLE IF NOT EXISTS `tbl_enquiry` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `Full_Name` VARCHAR(255) NOT NULL,
    `Email_Address` VARCHAR(255) NOT NULL,
    `company_name` VARCHAR(255) DEFAULT NULL,
    `Telephone_Number` VARCHAR(100) DEFAULT NULL,
    `country` VARCHAR(100) DEFAULT NULL,
    `subject` VARCHAR(255) DEFAULT 'General Enquiry',
    `Your_Message` TEXT NOT NULL,
    `ip_address` VARCHAR(50) DEFAULT NULL,
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX `idx_email` (`Email_Address`),
    INDEX `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Table for IP Rate Limiting (Prevents spam bots)
CREATE TABLE IF NOT EXISTS `ip_blocks` (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `ip_address` VARCHAR(50) NOT NULL UNIQUE,
    `request_count` INT NOT NULL DEFAULT 1,
    `blocked_until` DATETIME DEFAULT NULL,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_ip_blocked` (`ip_address`, `blocked_until`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
