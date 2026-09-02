// server.js - Servidor Principal Node.js + Express + MySQL para o Conecta Doações (Vakinha Style)

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/database');
const campaignRoutes = require('./routes/campaignRoutes');
const donationRoutes = require('./routes/donationRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da aplicação frontend se desejado
app.use(express.static(path.join(__dirname, '../')));

// Registrar Rotas da API REST
app.use('/api/campaigns', campaignRoutes);
app.use('/api/donations', donationRoutes);

// Endpoint de Health Check & Status do Banco
app.get('/api/status', (req, res) => {
  res.json({
    status: 'online',
    system: 'Conecta Doações - Backend API (Vakinha Style)',
    dbDriver: db.getDriver(),
    timestamp: new Date().toISOString()
  });
});

// Populador de Dados Iniciais (Seed Data)
async function seedInitialData() {
  try {
    const campaigns = await db.query('SELECT COUNT(*) as count FROM campaigns');
    const total = campaigns[0].count || campaigns[0]['COUNT(*)'] || 0;

    if (total === 0) {
      console.log('🌱 Populando dados iniciais no Banco de Dados...');

      const initialCampaigns = [
        {
          code: 'VK-1001',
          title: 'Ajude a Alimentar 200 Famílias - Cestas Básicas de Emergência',
          slug: 'ajude-alimentar-200-familias',
          category: 'alimentos',
          description: 'Estamos arrecadando cestas básicas para a comunidade periférica do Bairro Centenário. Muitas famílias com crianças estão em situação de extrema falta de suprimentos de arroz, feijão, óleo e leite.',
          target_amount: 15000.00,
          current_amount: 8450.00,
          target_items: 200,
          current_items: 112,
          unit: 'cestas',
          image_url: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80',
          creator_name: 'ONG Esperança Viva',
          creator_phone: '(47) 99123-4567',
          location: 'Blumenau - SC'
        },
        {
          code: 'VK-1002',
          title: 'Campanha do Agasalho e Cobertores - Inverno Sem Fome',
          slug: 'campanha-agasalho-cobertores',
          category: 'roupas',
          description: 'Aproxima-se a temporada de frio intenso e nosso albergue precisa de 300 cobertores e agasalhos infantis e adultos para acolher famílias vulneráveis.',
          target_amount: 8000.00,
          current_amount: 5200.00,
          target_items: 300,
          current_items: 195,
          unit: 'peças',
          image_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
          creator_name: 'Mãos Unidas da Comunidade',
          creator_phone: '(47) 98877-6655',
          location: 'Blumenau - SC'
        },
        {
          code: 'VK-1003',
          title: 'Kit Higiene Pessoal e Proteção para Mães Solteiras',
          slug: 'kit-higiene-pessoal-maes',
          category: 'higiene',
          description: 'Projeto para compra e distribuição de kits contendo fraldas descartáveis, sabonete infantil, creme dental, absorventes e shampoo para mães em situação de risco social.',
          target_amount: 6000.00,
          current_amount: 3800.00,
          target_items: 150,
          current_items: 95,
          unit: 'kits',
          image_url: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&auto=format&fit=crop&q=80',
          creator_name: 'Instituto Proteja',
          creator_phone: '(47) 99911-2233',
          location: 'Blumenau - SC'
        }
      ];

      for (const c of initialCampaigns) {
        await db.execute(
          `INSERT INTO campaigns (code, title, slug, category, description, target_amount, current_amount, target_items, current_items, unit, image_url, creator_name, creator_phone, is_verified, location, status)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, 'active')`,
          [c.code, c.title, c.slug, c.category, c.description, c.target_amount, c.current_amount, c.target_items, c.current_items, c.unit, c.image_url, c.creator_name, c.creator_phone, c.location]
        );
      }

      console.log('✅ Dados de teste populados com sucesso!');
    }
  } catch (err) {
    console.error('Erro ao popular dados iniciais:', err);
  }
}

// Inicializar Servidor
async function startServer() {
  await db.initDatabase();
  await seedInitialData();

  app.listen(PORT, () => {
    console.log(`🚀 Servidor Node.js rodando com SUCESSO na porta ${PORT}`);
    console.log(`🔗 API disponível em: http://localhost:${PORT}/api/campaigns`);
    console.log(`📊 Driver do Banco: ${db.getDriver().toUpperCase()}`);
  });
}

startServer();
