import AttachmentStore from '../../common/stores/__mocks__/AttachmentStore';
import RichEmbedStore from '../../common/stores/RichEmbedStore';

const mock = jest.fn().mockImplementation(() => {
  const store = {
    text: '',
    setPosting: jest.fn(),
    reset: jest.fn(),
    post: jest.fn(),
    loadSuggestedTags: jest.fn(),
    loadThirdPartySocialNetworkStatus: jest.fn(),
    attachment: new AttachmentStore(),
    embed: new RichEmbedStore(),
    isPosting: false,
    tags: [],
    inlineHashtags: [],
    allTags: [],
    addTag: jest.fn(),
    setText: jest.fn().mockImplementation((t) => (store.text = t)),
    deleteTag: jest.fn(),
    socialNetworks: {
      facebook: false,
      twitter: false,
    },
  };

  return store;
});

export default mock;
