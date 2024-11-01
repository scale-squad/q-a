const mongoose = require('mongoose');

// Ensure mongoose connection is closed after tests
afterAll(async () => {
  await mongoose.connection.close();
});