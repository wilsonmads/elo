// donationController.js - Controlador de Doações & Geração de PIX (Vakinha Style)

const db = require('../config/database');

// Registrar doação (com simulação de código PIX instantâneo e mensagem de apoio)
async function createDonation(req, res) {
  try {
    const {
      campaign_id,
      donor_name,
      amount,
      items_qty,
      payment_method,
      support_message
    } = req.body;

    if (!campaign_id) {
      return res.status(400).json({ success: false, message: 'ID da campanha é obrigatório' });
    }

    const valAmount = parseFloat(amount || 0);
    const valItems = parseInt(items_qty || 0);
    const finalDonor = donor_name && donor_name.trim() !== '' ? donor_name.trim() : 'Doador Anônimo';
    const method = payment_method || 'pix';

    // Gerar código PIX fictício único se a opção for PIX
    const pixCode = `00020126580014br.gov.bcb.pix0136${Math.random().toString(36).substring(2, 15)}${Date.now()}5204000053039865405${valAmount.toFixed(2)}5802BR5920CONECTA DOAÇÕES VK6009BLUMENAU62070503***630489A1`;

    const sqlDonation = `
      INSERT INTO donations (campaign_id, donor_name, amount, items_qty, payment_method, support_message, pix_code)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.execute(sqlDonation, [
      campaign_id,
      finalDonor,
      valAmount,
      valItems,
      method,
      support_message || 'Que essa doação ajude quem mais precisa! ❤️',
      pixCode
    ]);

    // Atualizar totais acumulados na vaquinha
    const sqlUpdateCampaign = `
      UPDATE campaigns
      SET current_amount = current_amount + ?,
          current_items = current_items + ?
      WHERE id = ?
    `;

    await db.execute(sqlUpdateCampaign, [valAmount, valItems, campaign_id]);

    res.status(201).json({
      success: true,
      message: 'Doação registrada com sucesso!',
      data: {
        id: result.insertId,
        campaign_id,
        amount: valAmount,
        items_qty: valItems,
        payment_method: method,
        pix_code: pixCode
      }
    });
  } catch (error) {
    console.error('Erro ao processar doação:', error);
    res.status(500).json({ success: false, message: 'Erro ao registrar doação' });
  }
}

// Obter apoiadores / doações de uma vaquinha
async function getDonations(req, res) {
  try {
    const { campaignId } = req.params;
    const donations = await db.query('SELECT * FROM donations WHERE campaign_id = ? ORDER BY id DESC LIMIT 50', [campaignId]);
    res.json({ success: true, count: donations.length, data: donations });
  } catch (error) {
    console.error('Erro ao buscar doações:', error);
    res.status(500).json({ success: false, message: 'Erro ao buscar apoiadores' });
  }
}

module.exports = {
  createDonation,
  getDonations
};
