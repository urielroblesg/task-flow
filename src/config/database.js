import mongoose from 'mongoose';

/** @returns {Promise<void>} */
export const conectarBd = async () => {
  const connectionString = process.env.MONGO_DB_URI;

  if (!connectionString) throw new Error('Falta MONGO_DB_URI');
  await mongoose.connect(connectionString, {
    serverSelectionTimeoutMS: 8000,
  });
};
