const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const memberController = {
  createMember: async (req, res, next) => {
    try {
      const member = await prisma.member.create({ data: req.body });
      res.status(201).json(member);
    } catch (error) { next(error); }
  },

  // MANDATORY TASK: GET /members/{id}/borrowed
  getBorrowedBooks: async (req, res, next) => {
    try {
      const transactions = await prisma.transaction.findMany({
        where: { 
          member_id: req.params.id,
          status: { in: ['active', 'overdue'] }
        },
        include: { book: true }
      });
      res.json(transactions);
    } catch (error) { next(error); }
  },

  getAllMembers: async (req, res, next) => {
    try {
      const members = await prisma.member.findMany();
      res.json(members);
    } catch (error) { next(error); }
  },

  getMemberById: async (req, res, next) => {
    try {
      const member = await prisma.member.findUnique({ where: { id: req.params.id } });
      res.json(member);
    } catch (error) { next(error); }
  },

  updateMember: async (req, res, next) => {
    try {
      const member = await prisma.member.update({
        where: { id: req.params.id },
        data: req.body
      });
      res.json(member);
    } catch (error) { next(error); }
  },

  deleteMember: async (req, res, next) => {
    try {
      await prisma.member.delete({ where: { id: req.params.id } });
      res.status(204).send();
    } catch (error) { next(error); }
  }
};

module.exports = memberController;