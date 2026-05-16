import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI || process.env.MONGODB_URL;

if (!uri) {
  console.error('Missing MONGODB_URI or MONGODB_URL in your environment.');
  process.exit(1);
}

try {
  await mongoose.connect(uri, {
    bufferCommands: false,
    serverSelectionTimeoutMS: 10000,
  });

  const result = await mongoose.connection.db.admin().ping();
  console.log('Database connection successful.');
  console.log(`Ping response: ${JSON.stringify(result)}`);
  console.log(`Connected database: ${mongoose.connection.name}`);
} catch (error) {
  console.error('Database connection failed.');
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
