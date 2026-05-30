import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User';

dotenv.config();

const usersToSeed = [
  {
    name: 'System Admin',
    email: 'admin@lms.com',
    password: 'Admin@123',
    role: 'admin',
  },
  {
    name: 'Sales Officer',
    email: 'sales@lms.com',
    password: 'Sales@123',
    role: 'sales',
  },
  {
    name: 'Sanction Officer',
    email: 'sanction@lms.com',
    password: 'Sanction@123',
    role: 'sanction',
  },
  {
    name: 'Disbursement Officer',
    email: 'disburse@lms.com',
    password: 'Disburse@123',
    role: 'disbursement',
  },
  {
    name: 'Collection Officer',
    email: 'collect@lms.com',
    password: 'Collect@123',
    role: 'collection',
  },
  {
    name: 'Borrower User',
    email: 'borrower@lms.com',
    password: 'Borrower@123',
    role: 'borrower',
  },
];

const seed = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/lms_db';
  console.log(`Connecting to MongoDB at ${uri}...`);

  try {
    await mongoose.connect(uri);
    console.log('Connected to MongoDB.');

    // Clear existing users
    const deleteResult = await User.deleteMany({});
    console.log(`Cleared ${deleteResult.deletedCount} existing user records.`);

    // Create exactly one user per role
    for (const userData of usersToSeed) {
      const user = new User(userData);
      await user.save();
      console.log(`Seeded user: ${user.email} (Role: ${user.role})`);
    }

    console.log('Database seeding completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();
