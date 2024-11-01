const request = require('supertest');
const app = require('../server/index.js');

describe('Questions API', () => {

  // GET /qa/questions
  test('should retrieve a list of questions for a specific product', async () => {
    const response = await request(app)
      .get('/qa/questions')
      .query({ product_id: Number(1), page: Number(1), count: Number(5) });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /qa/questions
  it('should add a question for a given product', async () => {
    const response = await request(app)
      .post('/qa/questions')
      .send({
        body: "This is a test question",
        name: "test_user",
        email: "test@example.com",
        product_id: 1
      });
    expect(response.status).toBe(201);
    expect(response.text).toBe("CREATED");
  });

  // PUT /qa/questions/:question_id/helpful
  it('should mark a question as helpful', async () => {
    const response = await request(app)
      .put('/qa/questions/1/helpful');
    expect(response.status).toBe(204);
  });

  // PUT /qa/questions/:question_id/report
  it('should report a question', async () => {
    const response = await request(app)
      .put('/qa/questions/1/report');
    expect(response.status).toBe(204);
  });
});