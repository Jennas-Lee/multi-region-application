import request from 'supertest';
import { server } from '../app';

describe('Testing Healthcheck', () => {
  test('GET /health', async () => {
    const res = await request(server).get('/health');
    expect(res.status).toBe(200);
  });
});
