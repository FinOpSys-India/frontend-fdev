module.exports = {
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',  // Mock CSS imports
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/src/test/__mocks__/fileMock.js',  // Mock image imports
  },
    transform: {
      '^.+\\.[t|j]sx?$': 'babel-jest',
    },
    transformIgnorePatterns: [
      'node_modules/(?!(axios)/)',  // Whitelist axios for transformation
    ],
     testEnvironment: "jsdom",
  };
  