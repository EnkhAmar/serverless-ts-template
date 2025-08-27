import { createHttpHandler } from '@/libs/lambda';

export const test = createHttpHandler(async () => {
  return { data: { message: 'Test!', env: process.env.AMAZON_REGION } };
});
