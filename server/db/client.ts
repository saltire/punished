import { Db, Document, MongoClient } from 'mongodb';


const uri = process.env.MONGODB_URI || '';

let dbPromise: Promise<Db>;

const connectToDB = async () => {
  const client = await MongoClient
    .connect(uri)
    .catch(err => {
      console.error('MongoDB connection error:', err);
      throw err;
    });

  process.on('exit', () => {
    console.log('Closing MongoDB connection...');
    client.close(false);
  });

  const db = client.db();

  return db;
};

export const db = () => {
  if (!dbPromise) {
    dbPromise = connectToDB();
  }
  return dbPromise;
};

export const getCollection = async <T extends Document>(name: string) => (await db())
  .collection<T>(name);
