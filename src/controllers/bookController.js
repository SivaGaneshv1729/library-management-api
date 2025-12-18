const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const bookController = {
  createBook: async (req, res, next) => {
    try {
      const book = await prisma.book.create({ data: req.body });
      res.status(201).json(book);
    } catch (error) { next(error); }
  },

  getAllBooks: async (req, res, next) => {
    try {
      const books = await prisma.book.findMany();
      res.json(books);
    } catch (error) { next(error); }
  },

  // MANDATORY TASK: GET /books/available
  getAvailable: async (req, res, next) => {
    try {
      const availableBooks = await prisma.book.findMany({
        where: { 
          status: 'available',
          available_copies: { gt: 0 }
        }
      });
      res.json(availableBooks);
    } catch (error) { next(error); }
  },

  getBookById: async (req, res, next) => {
    try {
      const book = await prisma.book.findUnique({ where: { id: req.params.id } });
      if (!book) throw new Error("Book not found");
      res.json(book);
    } catch (error) { next(error); }
  },

  updateBook: async (req, res, next) => {
    try {
      const book = await prisma.book.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(book);
    } catch (error) { next(error); }
  },

  deleteBook: async (req, res, next) => {
    try {
      await prisma.book.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) { next(error); }
  }
};

module.exports = bookController;