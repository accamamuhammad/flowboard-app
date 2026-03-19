import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
   log: process.env.NODE_ENV === 'development' 
     ? ['query', 'info', 'warn', 'error'] 
     : ['warn', 'error']    
});

const connectDb = async () => {
    try {
        await prisma.$connect();
        console.log("Database is connected");
    } catch (error) {
        console.log(`Database connection error: ${error.message}`);
    }
}

const disconnectDb = async () => {
    await prisma.$disconnect();
    console.log("Database is disconnected");
}

export { prisma, connectDb, disconnectDb };