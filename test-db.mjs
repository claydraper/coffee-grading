import { prisma } from './app/lib/prisma.js';

async function testDbConnection() {
  try {
    console.log('Testing database connection...');
    const users = await prisma.user.findMany();
    console.log('Database connection successful!');
    console.log('Users in database:', users);
    
    // Test sessions table
    const sessions = await prisma.session.findMany();
    console.log('Sessions in database:', sessions);
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDbConnection();
