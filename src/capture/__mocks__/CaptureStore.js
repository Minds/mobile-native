import AttachmentStore from '../../common/stores/__mocks__/AttachmentStore';

const mock = jest.fn().mockImplementation(() => {

  return {
    setPosting: jest.fn(),
    reset: jest.fn(),
    post: jest.fn(),
    loadThirdPartySocialNetworkStatus: jest.fn(),
    attachment: new AttachmentStore(),
    isPosting: false,
    socialNetworks: {
      facebook: false,
      twitter: false,
    }
  };
});

export default mock;
