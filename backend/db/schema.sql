-- Script de Criação do Banco de Dados MySQL para o Conecta Doações (Vakinha Style)

CREATE DATABASE IF NOT EXISTS conecta_doacoes CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE conecta_doacoes;

-- Tabela de Campanhas / Vaquinhas
CREATE TABLE IF NOT EXISTS campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(20) NOT NULL UNIQUE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'alimentos',
  description TEXT NOT NULL,
  target_amount DECIMAL(10,2) DEFAULT 0.00,
  current_amount DECIMAL(10,2) DEFAULT 0.00,
  target_items INT DEFAULT 0,
  current_items INT DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'unidades',
  image_url TEXT,
  creator_name VARCHAR(100) NOT NULL,
  creator_phone VARCHAR(50),
  is_verified BOOLEAN DEFAULT TRUE,
  location VARCHAR(150) NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  deadline DATE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Doações / Apoios
CREATE TABLE IF NOT EXISTS donations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  donor_name VARCHAR(100) DEFAULT 'Doador Anônimo',
  amount DECIMAL(10,2) DEFAULT 0.00,
  items_qty INT DEFAULT 0,
  payment_method VARCHAR(20) DEFAULT 'pix',
  support_message TEXT,
  pix_code TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de Atualizações do Criador (Feed de Transparência)
CREATE TABLE IF NOT EXISTS updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
