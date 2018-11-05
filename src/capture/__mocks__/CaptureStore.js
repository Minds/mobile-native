import AttachmentStore from '../../common/stores/__mocks__/AttachmentStore';
import RichEmbedStore from '../../common/stores/RichEmbedStore';

const mock = jest.fn().mockImplementation(() => {

  return {
    setPosting: jest.fn(),
    reset: jest.fn(),
    post: jest.fn(),
    loadThirdPartySocialNetworkStatus: jest.fn(),
    attachment: new AttachmentStore(),
    embed: new RichEmbedStore(),
    isPosting: false,
    socialNetworks: {
      facebook: false,
      twitter: false,
    }
  };
});

export default mock;
