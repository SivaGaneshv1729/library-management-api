const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// Full CRUD for Members
router.post('/', memberController.createMember);          // POST /members
router.get('/', memberController.getAllMembers);         // GET /members
router.get('/:id', memberController.getMemberById);       // GET /members/{id}
router.put('/:id', memberController.updateMember);       // PUT /members/{id}
router.delete('/:id', memberController.deleteMember);    // DELETE /members/{id}

// View books currently borrowed by a member
router.get('/:id/borrowed', memberController.getBorrowedBooks); // GET /members/{id}/borrowed

module.exports = router;