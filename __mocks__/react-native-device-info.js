module.exports = {
  getVersion: jest.fn().mockImplementation(() => '3.8.0'),
  getBuildNumber: jest.fn(),
  // add more methods as needed
};