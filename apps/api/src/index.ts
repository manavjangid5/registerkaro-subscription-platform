import 'dotenv/config';
import mongoose from 'mongoose';

import { createApp } from './app.js';
import { loadEnv } from './config/env.js';

const env = loadEnv();

async function start(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);
  const app = createApp();
  app.listen(env.PORT, () => {
    console.log(`API listening on http://localhost:${String(env.PORT)}`);
  });
}

start().catch((error: unknown) => {
  console.error('Failed to start API:', error);
  process.exit(1);
});