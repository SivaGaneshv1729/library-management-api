/**
 * prisma/seed.js
 * Automatically populates the database with initial test data.
 */
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // 1. Clean existing data (Optional: removes old data to prevent unique constraints)
  await prisma.transaction.deleteMany();
  await prisma.book.deleteMany();
  await prisma.member.deleteMany();

  // 2. Seed Members
  const member1 = await prisma.member.create({
    data: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      membership_number: 'MEM001',
      status: 'active'
    },
  });

  const member2 = await prisma.member.create({
    data: {
      name: 'Bob Smith',
      email: 'bob@example.com',
      membership_number: 'MEM002',
      status: 'active'
    },
  });

  // 3. Seed Books
  const book1 = await prisma.book.create({
    data: {
      isbn: '978-0132350884',
      title: 'Clean Code',
      author: 'Robert C. Martin',
      category: 'Programming',
      total_copies: 3,
      available_copies: 3,
    },
  });

  const book2 = await prisma.book.create({
    data: {
      isbn: '978-0201633610',
      title: 'Design Patterns',
      author: 'Erich Gamma',
      category: 'Software Engineering',
      total_copies: 1,
      available_copies: 1,
    },
  });

  const book3 = await prisma.book.create({
    data: {
      isbn: '978-0134494166',
      title: 'Clean Architecture',
      author: 'Robert C. Martin',
      category: 'Programming',
      total_copies: 5,
      available_copies: 5,
    },
  });

  console.log('✅ Seeding complete!');
  console.log(`Created Members: ${member1.name}, ${member2.name}`);
  console.log(`Created Books: ${book1.title}, ${book2.title}, ${book3.title}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });