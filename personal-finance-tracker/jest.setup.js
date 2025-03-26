jest.setTimeout(30000); // Set the timeout for async tests to 30 seconds (optional)

// Global test setup file
process.env.NODE_ENV = "test";
process.env.PORT = 0; // This will make tests use an available port

// Close any existing connections after tests
afterAll(async () => {
  // Add any cleanup needed for your tests
  // For example: await mongoose.connection.close();

  // If you have any server instances running, close them
  if (global.server) {
    await new Promise((resolve) => {
      global.server.close(resolve);
    });
  }
});
