const { prisma } = require('./app/lib/prisma');

async function testDbConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test users table
    const users = await prisma.user.findMany();
    console.log('Users in database:', users);
    
    // Test sessions table
    const sessions = await prisma.session.findMany();
    console.log('Sessions in database:', sessions);
    
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDbConnection();
