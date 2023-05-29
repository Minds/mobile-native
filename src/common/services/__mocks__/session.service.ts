//@ts-nocheck
export default {
  login: jest.fn(),
  logout: jest.fn(),
  isLoggedIn: jest.fn(),
  setInitialScreen: jest.fn(),
  onLogin: jest.fn(),
  onLogout: jest.fn(),
  onSession: jest.fn(),
  getUser: jest.fn(),
};

export const isTokenExpired = jest.fn();
