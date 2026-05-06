// invoiceRoutes.js - billing aur invoices ke routes
const express = require('express');
const router = express.Router();
const { getInvoice, getAllInvoices } = require('../controllers/invoiceController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', getAllInvoices);
router.get('/:bookingId', getInvoice);

module.exports = router;
