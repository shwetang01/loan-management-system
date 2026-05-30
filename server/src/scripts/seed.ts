import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';

dotenv.config();

const users = [
  {
    name: 'Admin User',
    email: 'admin@lms.com',
    password: 'password123',
    role: 'admin',
  },
  {
    name: 'Sales Officer One',
    email: 'sales@lms.com',
    password: 'password123',
    role: 'sales_officer',
  },
  {
    name: 'Sanction Officer One',
    email: 'sanction@lms.com',
    password: 'password123',
    role: 'sanction_officer',
  },
  {
    name: 'Disbursement Officer One',
    email: 'disbursement@lms.com',
    password: 'password123',
    role: 'disbursement_officer',
  },
  {
    name: 'Collection Officer One',
    email: 'collection@lms.com',
    password: 'password123',
    role: 'collection_officer',
  },
  {
    name: 'Borrower Client One',
    email: 'borrower@lms.com',
    password: 'password123',
    role: 'borrower',
  },
];

const seedDB = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI environment variable is missing.');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    console.log('Seed: MongoDB Connected.');

    // Clear old users
    await User.deleteMany({});
    console.log('Seed: Cleaned existing Users collection.');

    // Insert seeds
    for (const u of users) {
      const newUser = new User(u);
      await newUser.save();
      console.log(`Seed: Created user ${u.name} [${u.role}]`);
    }

    console.log('Seed database setup completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Seed: Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
