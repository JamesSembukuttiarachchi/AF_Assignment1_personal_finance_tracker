module.exports = {
  testEnvironment: "node", // Use Node.js as the environment for testing

  // Transpile modern JavaScript (ES6+) using Babel before running tests
  transform: {
    "^.+\\.js$": "babel-jest",
  },

  // Setup file to run before tests
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],

  // Enable code coverage collection
  collectCoverage: true,

  // Store coverage reports in the coverage folder at the root of the project
  coverageDirectory: "<rootDir>/coverage",

  // Ignore test files in node_modules and build directories
  testPathIgnorePatterns: ["/node_modules/", "/build/"],
};
