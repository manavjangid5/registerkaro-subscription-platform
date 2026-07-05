import 'dotenv/config';
import mongoose from 'mongoose';

import { loadEnv } from '../config/env.js';
import { Plan } from '../models/index.js';

const env = loadEnv();

// All prices in paise. 1 rupee = 100 paise. Never store/compute as float.
const PLANS = [
  {
    planGroup: 'basic',
    name: 'Basic',
    description: 'Core features for individuals getting started.',
    billingInterval: 'MONTHLY' as const,
    priceInPaise: 29900, // ₹299
    features: ['5 projects', 'Community support', 'Basic analytics'],
    sortOrder: 1,
  },
  {
    planGroup: 'basic',
    name: 'Basic',
    description: 'Core features for individuals getting started.',
    billingInterval: 'YEARLY' as const,
    priceInPaise: 299900, // ₹2,999 (~2 months free vs monthly)
    features: ['5 projects', 'Community support', 'Basic analytics'],
    sortOrder: 2,
  },
  {
    planGroup: 'pro',
    name: 'Pro',
    description: 'Advanced features for growing teams.',
    billingInterval: 'MONTHLY' as const,
    priceInPaise: 59900, // ₹599
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Team seats'],
    sortOrder: 3,
  },
  {
    planGroup: 'pro',
    name: 'Pro',
    description: 'Advanced features for growing teams.',
    billingInterval: 'YEARLY' as const,
    priceInPaise: 599900, // ₹5,999
    features: ['Unlimited projects', 'Priority support', 'Advanced analytics', 'Team seats'],
    sortOrder: 4,
  },
];

async function seed(): Promise<void> {
  await mongoose.connect(env.MONGODB_URI);

  for (const plan of PLANS) {
    await Plan.findOneAndUpdate(
      { planGroup: plan.planGroup, billingInterval: plan.billingInterval, isActive: true },
      { $set: plan },
      { upsert: true, new: true },
    );
    console.log(`Seeded: ${plan.name} (${plan.billingInterval})`);
  }

  console.log('Done.');
  await mongoose.disconnect();
}

seed().catch((error: unknown) => {
  console.error('Seed failed:', error);
  process.exit(1);
});