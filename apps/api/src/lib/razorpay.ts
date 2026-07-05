import Razorpay from 'razorpay';

import { loadEnv } from '../config/env.js';

const env = loadEnv();

export const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});