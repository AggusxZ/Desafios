const express = require('express');
const router = express.Router();
const viewController = require('../controllers/view/viewController');

router.get('/home', viewController.renderHome);

router.get('/realtimeproducts', viewController.renderRealTimeProducts);

module.exports = router;