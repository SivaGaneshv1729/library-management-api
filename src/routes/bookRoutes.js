const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');

// Full CRUD for Books
router.post('/', bookController.createBook);           // POST /books
router.get('/', bookController.getAllBooks);          // GET /books
router.get('/available', bookController.getAvailable); // GET /books/available (Mandatory Task)
router.get('/:id', bookController.getBookById);        // GET /books/{id}
router.put('/:id', bookController.updateBook);        // PUT /books/{id}
router.delete('/:id', bookController.deleteBook);     // DELETE /books/{id}

module.exports = router;