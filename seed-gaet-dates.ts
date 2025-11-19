import mongoose from 'mongoose';
import dotenv from 'dotenv';
import GAETDate from './src/models/GAETDate';
import connectDB from './src/config/db';

// Load environment variables
dotenv.config();

const gaetDatesData = [
  {
    date: "June 15, 2026",
    mode: "Online Mode",
    isActive: true,
  },
  {
    date: "June 22, 2026",
    mode: "Offline Mode",
    isActive: true,
  },
  {
    date: "July 5, 2026",
    mode: "Online Mode",
    isActive: true,
  },
];

async function seedGAETDates() {
  try {
    console.log('Connecting to database...');
    await connectDB();
    
    // Wait a bit for connection to establish
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    console.log('Clearing existing GAET dates...');
    await GAETDate.deleteMany({});
    console.log('Existing data cleared.');
    
    console.log('Inserting GAET dates...');
    const inserted = await GAETDate.insertMany(gaetDatesData);
    
    console.log(`✅ Successfully inserted ${inserted.length} GAET dates!`);
    console.log('\nInserted records:');
    inserted.forEach((item, index) => {
      console.log(`${index + 1}. ${item.date} - ${item.mode}`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding GAET dates:', error);
    process.exit(1);
  }
}

// Run the seed function
seedGAETDates();

