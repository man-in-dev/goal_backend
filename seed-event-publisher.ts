import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './src/config/db';
import User from './src/models/User';

// Load environment variables
dotenv.config();

async function seedEventPublisherUser() {
  try {
    console.log('Connecting to database...');
    await connectDB();

    // Small delay to ensure the connection is fully established
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const email = process.env.EVENT_PUBLISHER_EMAIL || 'event.publisher@goalinstitute.com';
    const password = process.env.EVENT_PUBLISHER_PASSWORD || 'eventPublisher123';

    console.log(`Seeding event publisher user with email: ${email}`);

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      console.log('User already exists. Updating role to event_publisher and activating account...');
      user.role = 'event_publisher';
      user.isActive = true;
      await user.save();
    } else {
      console.log('User does not exist. Creating new event_publisher user...');
      user = await User.create({
        name: 'Event Publisher',
        email,
        password,
        role: 'event_publisher',
        isActive: true,
      });
    }

    console.log('✅ Event publisher user seeded successfully:');
    console.log(`- ID: ${user._id}`);
    console.log(`- Email: ${user.email}`);
    console.log(`- Role: ${user.role}`);

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding event publisher user:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the seed function
seedEventPublisherUser();


