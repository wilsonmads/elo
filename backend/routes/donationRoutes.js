// donationRoutes.js - Rotas REST API para Doações

const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');

router.post('/', donationController.createDonation);
router.get('/campaign/:campaignId', donationController.getDonations);

module.exports = router;
