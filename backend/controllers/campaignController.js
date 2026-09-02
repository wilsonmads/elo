// campaignController.js - Controlador de Vaquinhas / Campanhas

const db = require('../config/database');

// Listar vaquinhas com suporte a filtro por categoria e busca por palavra-chave
async function getCampaigns(req, res) {
  try {
    const { category, search } = req.query;
    let sql = 'SELECT * FROM campaigns WHERE status = "active"';
    const params = [];

    if (category && category !== 'todos') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (search && search.trim() !== '') {
      sql += ' AND (title LIKE ? OR description LIKE ? OR location LIKE ? OR creator_name LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term, term);
    }

    sql += ' ORDER BY id DESC';

    const campaigns = await db.query(sql, params);
    res.json({ success: true, count: campaigns.length, data: campaigns });
  } catch (error) {
    console.error('Erro ao buscar campanhas:', error);
    res.status(500).json({ success: false, message: 'Erro interno no servidor' });
  }
}

// Obter detalhes de uma vaquinha específica
async function getCampaignById(req, res) {
  try {
    const { id } = req.params;
    const campaigns = await db.query('SELECT * FROM campaigns WHERE id = ? OR code = ?', [id, id]);

    if (campaigns.length === 0) {
      return res.status(404).json({ success: false, message: 'Vaquinha não encontrada' });
    }

    const campaign = campaigns[0];
    const donations = await db.query('SELECT * FROM donations WHERE campaign_id = ? ORDER BY id DESC LIMIT 20', [campaign.id]);
    const updates = await db.query('SELECT * FROM updates WHERE campaign_id = ? ORDER BY id DESC', [campaign.id]);

    res.json({
      success: true,
      data: {
        ...campaign,
        donations,
        updates
      }
    });
  } catch (error) {
    console.error('Erro ao obter detalhes da vaquinha:', error);
    res.status(500).json({ success: false, message: 'Erro interno ao carregar vaquinha' });
  }
}

// Criar nova vaquinha / campanha estilo Vakinha
async function createCampaign(req, res) {
  try {
    const {
      title,
      category,
      description,
      target_amount,
      target_items,
      unit,
      image_url,
      creator_name,
      creator_phone,
      location,
      deadline
    } = req.body;

    if (!title || !description || !creator_name || !location) {
      return res.status(400).json({ success: false, message: 'Preencha todos os campos obrigatórios' });
    }

    const code = 'VK-' + Math.floor(1000 + Math.random() * 9000);
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const finalImage = image_url || 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80';

    const sql = `
      INSERT INTO campaigns (
        code, title, slug, category, description,
        target_amount, current_amount, target_items, current_items,
        unit, image_url, creator_name, creator_phone, is_verified, location, deadline
      ) VALUES (?, ?, ?, ?, ?, ?, 0.00, ?, 0, ?, ?, ?, ?, 1, ?, ?)
    `;

    const params = [
      code,
      title,
      slug,
      category || 'alimentos',
      description,
      parseFloat(target_amount || 0),
      parseInt(target_items || 0),
      unit || 'unidades',
      finalImage,
      creator_name,
      creator_phone || '',
      location,
      deadline || '2026-12-31'
    ];

    const result = await db.execute(sql, params);

    res.status(201).json({
      success: true,
      message: 'Vaquinha criada com sucesso!',
      data: {
        id: result.insertId,
        code,
        title
      }
    });
  } catch (error) {
    console.error('Erro ao criar vaquinha:', error);
    res.status(500).json({ success: false, message: 'Falha ao cadastrar vaquinha' });
  }
}

module.exports = {
  getCampaigns,
  getCampaignById,
  createCampaign
};
