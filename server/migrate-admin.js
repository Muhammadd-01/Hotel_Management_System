// migrate-admin.js - One-time script to update 'admin' role to 'superadmin'
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const result = await mongoose.connection.db.collection('users').updateMany(
      { role: 'admin' },
      { $set: { role: 'superadmin' } }
    );
    
    console.log(`✅ Updated ${result.modifiedCount} user(s) from 'admin' to 'superadmin'`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Migration failed:', err);
    process.exit(1);
  }
};

run();
