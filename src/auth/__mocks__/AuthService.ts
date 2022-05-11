export default {
  login: jest.fn(),
  logout: jest.fn(),
  forgot: jest.fn(),
  register: jest.fn(),
  refreshToken: jest.fn(),
  tryToRelog: jest.fn().mockImplementation(() => false),
};
