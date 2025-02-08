const request = require('supertest');
const app = require('../src/server'); 
describe('API Endpoints', () => {
  it('should respond with a 200 status code on GET /api/status', async () => {
    const response = await request(app).get('/api/status');
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Server is running');
  });

  // Add more API endpoint tests as needed
});
