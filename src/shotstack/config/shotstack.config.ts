import { registerAs } from '@nestjs/config';

export default registerAs('shotstack', () => ({
  apiKey: process.env.SHOTSTACK_API_KEY,
  apiUrl: process.env.SHOTSTACK_API_URL || 'https://api.shotstack.io',
}));
