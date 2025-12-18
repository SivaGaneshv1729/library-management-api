const LibraryService = require('../services/libraryService');

const trxController = {
  borrowBook: async (req, res, next) => {
    try {
      const { memberId, bookId } = req.body;
      const result = await LibraryService.borrowBook(memberId, bookId);
      res.status(201).json(result);
    } catch (error) { next(error); }
  },

  returnBook: async (req, res, next) => {
    try {
      const result = await LibraryService.returnBook(req.params.id);
      res.json(result);
    } catch (error) { next(error); }
  },

  // MANDATORY TASK: GET /transactions/overdue
  listOverdue: async (req, res, next) => {
    try {
      // Sync statuses before listing
      await LibraryService.syncOverdueStatus();
      
      const overdue = await prisma.transaction.findMany({
        where: { status: 'overdue' },
        include: { member: true, book: true }
      });
      res.json(overdue);
    } catch (error) { next(error); }
  }
};

module.exports = trxController;