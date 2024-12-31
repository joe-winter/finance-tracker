const dotenv = require("dotenv")
dotenv.config({ path: './.env.test'})

/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+.tsx?$": ["ts-jest",{}],
  },
  maxWorkers: 1,
  verbose: true
};