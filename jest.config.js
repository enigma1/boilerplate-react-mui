const {defaults} = require('jest-config');
module.exports = {
  // ...
  moduleFileExtensions: [...defaults.moduleFileExtensions, 'js'],
  testEnvironment: "jsdom",
  silent: true,
  //setupFilesAfterEnv: ["<rootDir>/__tests__/setup.js"],
};
