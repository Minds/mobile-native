//@ts-nocheck
export default {
  getSettings: jest.fn(),
  hasPermission: jest.fn().mockResolvedValue(true),
  update: jest.fn().mockResolvedValue({}),
};
