import { toJS } from 'mobx';

import HashtagStore from '~/common/stores/HashtagStore';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');
// mock services
sp.mockService('hashtag');

/**
 * Tests
 */
describe('Hashtag store', () => {
  let store;

  beforeEach(() => {
    store = new HashtagStore();
  });

  it("it should add the tag as suggested if it doesn't exist", () => {
    const fakeTags = [
      {
        value: 'Minds',
        type: 'user',
        selected: false,
      },
      {
        value: 'tag1',
        type: 'user',
        selected: false,
      },
    ];

    const expected = [
      {
        value: 'Minds',
        type: 'user',
        selected: false,
      },
      {
        value: 'tag1',
        type: 'user',
        selected: false,
      },
      {
        value: 'tag2',
        selected: false,
      },
    ];

    store.setSuggested(fakeTags);
    store.setHashtag('tag1');

    expect(toJS(store.suggested)).toEqual(fakeTags);

    store.setHashtag('tag2');

    expect(toJS(store.suggested)).toEqual(expected);
  });
});
