import mongoose from 'mongoose';

const uri = process.env.URI;
export async function databaseConnection() {
  try {
    await mongoose.connect(uri!);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
  }
}