const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const LibraryService = {
  /**
   * BORROW BOOK
   * Rules: Max 3 books, No unpaid fines, Member must be active, Book must be available.
   */
  async borrowBook(memberId, bookId) {
    return await prisma.$transaction(async (tx) => {
      // 1. Validate Member
      const member = await tx.member.findUnique({
        where: { id: memberId },
        include: { 
          transactions: { where: { status: 'active' } },
          fines: { where: { paid_at: null } }
        }
      });

      if (!member) throw new Error("Member not found.");
      if (member.status === 'suspended') throw new Error("Member is suspended from borrowing.");
      
      // Rule: Member cannot borrow more than 3 books simultaneously
      if (member.transactions.length >= 3) throw new Error("Borrowing limit (3 books) reached.");
      
      // Rule: Member with any unpaid fines is blocked from borrowing
      if (member.fines.length > 0) throw new Error("Borrowing blocked: Member has unpaid fines.");

      // 2. Validate Book Availability
      const book = await tx.book.findUnique({ where: { id: bookId } });
      if (!book || book.status !== 'available' || book.available_copies <= 0) {
        throw new Error("The requested book is currently unavailable.");
      }

      // 3. Create Transaction
      const borrowedAt = new Date();
      const dueDate = new Date();
      // Rule: Standard loan period is 14 days
      dueDate.setDate(borrowedAt.getDate() + 14);

      const transaction = await tx.transaction.create({
        data: {
          member_id: memberId,
          book_id: bookId,
          borrowed_at: borrowedAt,
          due_date: dueDate,
          status: 'active'
        }
      });

      // 4. Update Book State (State Machine)
      const newAvailableCopies = book.available_copies - 1;
      await tx.book.update({
        where: { id: bookId },
        data: { 
          available_copies: newAvailableCopies,
          // Update status if no copies left
          status: newAvailableCopies === 0 ? 'borrowed' : 'available'
        }
      });

      return transaction;
    });
  },

  /**
   * RETURN BOOK
   * Rules: Calculate $0.50/day fine, update book copies, update member suspension.
   */
  async returnBook(transactionId) {
    return await prisma.$transaction(async (tx) => {
      const trx = await tx.transaction.findUnique({
        where: { id: transactionId },
        include: { book: true }
      });

      if (!trx || trx.status === 'returned') throw new Error("Invalid or already completed transaction.");

      const returnedAt = new Date();
      let fineAmount = 0;

      // Rule: Overdue penalty of $0.50 per day
      if (returnedAt > trx.due_date) {
        const diffTime = Math.abs(returnedAt - trx.due_date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        fineAmount = diffDays * 0.50;
      }

      // 1. Update Transaction
      await tx.transaction.update({
        where: { id: transactionId },
        data: { 
          returned_at: returnedAt,
          status: 'returned' 
        }
      });

      // 2. Create Fine Record if applicable
      if (fineAmount > 0) {
        await tx.fine.create({
          data: {
            member_id: trx.member_id,
            transaction_id: transactionId,
            amount: fineAmount
          }
        });
      }

      // 3. Update Book Availability
      await tx.book.update({
        where: { id: trx.book_id },
        data: { 
          available_copies: trx.book.available_copies + 1,
          status: 'available' 
        }
      });

      // 4. Check Suspension Rule: Suspended if 3+ concurrently overdue
      await this.syncMemberSuspension(trx.member_id, tx);

      return { 
        message: "Book returned successfully", 
        fineApplied: fineAmount,
        transactionId: trx.id 
      };
    });
  },

  /**
   * MANAGE OVERDUE STATES & SUSPENSION
   * Rule: Member status changed to 'suspended' if 3+ concurrently overdue books
   */
  async syncMemberSuspension(memberId, txClient = prisma) {
    const now = new Date();

    // Identify active transactions that are now overdue
    const overdueTransactions = await txClient.transaction.findMany({
      where: {
        member_id: memberId,
        status: 'active',
        due_date: { lt: now }
      }
    });

    // If 3 or more are overdue, suspend the member
    if (overdueTransactions.length >= 3) {
      await txClient.member.update({
        where: { id: memberId },
        data: { status: 'suspended' }
      });
      
      // Update transaction statuses to 'overdue' in the DB
      await txClient.transaction.updateMany({
        where: {
          id: { in: overdueTransactions.map(t => t.id) }
        },
        data: { status: 'overdue' }
      });
    }
  }
};

module.exports = LibraryService;