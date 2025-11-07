import { prisma } from './app/lib/prisma';

async function testDbConnection() {
  try {
    console.log('Testing database connection...');
    const users = await prisma.user.findMany();
    console.log('Database connection successful!');
    console.log('Users in database:', users);
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDbConnection();
