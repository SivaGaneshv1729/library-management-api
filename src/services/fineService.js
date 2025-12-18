// src/services/fineService.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const payFine = async (fineId) => {
  const fine = await prisma.fine.findUnique({ where: { id: fineId } });
  if (!fine) throw new Error("Fine record not found.");
  if (fine.paid_at) throw new Error("Fine is already paid.");

  return await prisma.fine.update({
    where: { id: fineId },
    data: { paid_at: new Date() }
  });
};

module.exports = { payFine };