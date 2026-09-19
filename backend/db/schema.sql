-- ============================================================================
-- SCRIPT DE CRIAÇÃO DO BANCO DE DADOS MYSQL PARA O SOLIDARAÇÃO
-- Compatível com: MySQL 8.0, MySQL 8.4 e MySQL 9.x / MySQL Workbench
-- Instruções:
-- 1. Abra o MySQL Workbench
-- 2. Conecte-se na sua instância Local (root)
-- 3. Abra este arquivo (File -> Open SQL Script -> schema.sql)
-- 4. Clique no ícone do Raio (Execute) para criar o banco e as tabelas
-- ============================================================================

CREATE DATABASE IF NOT EXISTS solidaracao CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE solidaracao;

-- 1. Tabela de Campanhas Solidárias
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

-- 2. Tabela de Doações & Apoios (PIX e Mantimentos)
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

-- 3. Tabela de Atualizações do Criador (Transparência / Modelo 3C)
CREATE TABLE IF NOT EXISTS updates (
  id INT AUTO_INCREMENT PRIMARY KEY,
  campaign_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- 4. Dados Iniciais de Teste (Campanhas em Destaque)
INSERT IGNORE INTO campaigns 
  (id, code, title, slug, category, description, target_amount, current_amount, target_items, current_items, unit, image_url, creator_name, creator_phone, is_verified, location, status)
VALUES 
  (1, 'SA-1001', 'Ajude a Alimentar 200 Famílias — Cestas Básicas de Emergência', 'ajude-alimentar-200-familias', 'alimentos', 'Estamos arrecadando cestas básicas e recursos para garantir alimentação completa de 200 famílias periféricas que enfrentam extrema vulnerabilidade alimentar.', 15000.00, 8450.00, 200, 112, 'cestas', 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80', 'ONG Esperança Viva', '(88) 99123-4567', 1, 'Aracati — CE', 'active'),
  (2, 'SA-1002', 'Campanha do Agasalho e Cobertores — Inverno Sem Fome', 'campanha-agasalho-cobertores', 'roupas', 'Arrecadação de agasalhos de frio, roupas infantis e cobertores grossos para famílias e albergados durante as baixas temperaturas.', 8000.00, 5200.00, 300, 195, 'peças', 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80', 'ONG Mãos Unidas', '(88) 98877-6655', 1, 'Aracati — CE', 'active'),
  (3, 'SA-1003', 'Kit Higiene Pessoal e Proteção para Mães Solteiras', 'kit-higiene-pessoal-maes', 'higiene', 'Compra e distribuição de kits contendo fraldas descartáveis, sabonete infantil, creme dental, absorventes e produtos de higiene essenciais.', 6000.00, 3800.00, 150, 95, 'kits', 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80', 'Instituto Proteja', '(88) 99911-2233', 1, 'Aracati — CE', 'active');
