//@ts-nocheck
export default {
  canCreatePost: jest.fn().mockImplementation(() => true),
  canComment: jest.fn().mockImplementation(() => true),
  canUploadVideo: jest.fn().mockImplementation(() => true),
  canInteract: jest.fn().mockImplementation(() => true),
  canCreateGroup: jest.fn().mockImplementation(() => true),
  canBoost: jest.fn().mockImplementation(() => true),
};
