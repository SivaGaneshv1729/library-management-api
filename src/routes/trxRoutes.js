const express = require('express');
const router = express.Router();
const trxController = require('../controllers/trxController');
const fineController = require('../controllers/fineController');

// Borrowing Lifecycle
router.post('/borrow', trxController.borrowBook);      // POST /transactions/borrow
router.post('/:id/return', trxController.returnBook);  // POST /transactions/{id}/return

// Reporting
router.get('/overdue', trxController.listOverdue);     // GET /transactions/overdue

// Fines
router.post('/fines/:id/pay', fineController.payFine); // POST /fines/{id}/pay

module.exports = router;