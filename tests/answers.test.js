const request = require('supertest');
const app = require('../server/index.js');

describe('Answers API', () => {

  // GET /qa/questions/:question_id/answers
  test('should retrieve answers for a given question', async () => {
    const response = await request(app)
      .get('/qa/questions/1/answers')
      .query({ page: Number(1), count: Number(5) });

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  // POST /qa/questions/:question_id/answers
  it('should add an answer to a given question', async () => {
    const response = await request(app)
      .post('/qa/questions/1/answers')
      .send({
        body: "This is a test answer",
        name: "test_user",
        email: "test@example.com",
        photos: []
      });
    expect(response.status).toBe(201);
    expect(response.text).toBe("CREATED");
  });

  // PUT /qa/answers/:answer_id/helpful
  it('should mark an answer as helpful', async () => {
    const response = await request(app)
      .put('/qa/answers/1/helpful');
    expect(response.status).toBe(204);
  });

  // PUT /qa/answers/:answer_id/report
  it('should report an answer', async () => {
    const response = await request(app)
      .put('/qa/answers/1/report');
    expect(response.status).toBe(204);
  });
});