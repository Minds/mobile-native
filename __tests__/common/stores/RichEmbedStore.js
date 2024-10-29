import { toJS } from 'mobx';

import RichEmbedStore from '~/common/stores/RichEmbedStore';
import RichEmbedService from '~/common/services/rich-embed.service';
import sp from '~/services/serviceProvider';

jest.mock('~/services/serviceProvider');

// mock services
const richEmbedService = sp.mockService('richEmbed');

/**
 * Tests
 */
describe('rich embed store', () => {
  let store;

  beforeEach(() => {
    store = new RichEmbedStore();
    richEmbedService.getMeta.mockClear();
  });

  it('it should return metadata from links without protocol', async () => {
    const fakeMeta = {
      meta: {
        title: 'Minds',
        description: 'The crypto social network',
        url: 'www.minds.com',
      },
    };

    richEmbedService.getMeta.mockResolvedValue(fakeMeta);

    const promise = store.richEmbedCheck('hello www.minds.com');

    await promise;

    jest.advanceTimersByTime(1000);

    await store.setRichEmbedPromise;

    expect(toJS(store.meta)).toEqual(fakeMeta);
    expect(richEmbedService.getMeta).toBeCalledWith('https://www.minds.com');
  });

  it('it should return metadata from links with protocol', async () => {
    const fakeMeta = {
      meta: {
        title: 'Minds with protocol',
        description: 'The crypto social network',
        url: 'www.minds.com',
      },
    };

    richEmbedService.getMeta.mockResolvedValue(fakeMeta);

    const promise = store.richEmbedCheck(
      'hello https://www.minds.com/somelong/url?withparams=true&or=false',
    );

    await promise;

    jest.advanceTimersByTime(1000);

    await store.setRichEmbedPromise;

    expect(toJS(store.meta)).toEqual(fakeMeta);
    expect(richEmbedService.getMeta).toBeCalledWith(
      'https://www.minds.com/somelong/url?withparams=true&or=false',
    );
  });

  it('it should return metadata from links with protocol http', async () => {
    const fakeMeta = {
      meta: {
        title: 'Minds with protocol',
        description: 'The crypto social network',
        url: 'www.minds.com',
      },
    };

    richEmbedService.getMeta.mockResolvedValue(fakeMeta);

    const promise = store.richEmbedCheck(
      'hello http://www.minds.com/somelong/url?withparams=true&or=false',
    );

    await promise;

    jest.advanceTimersByTime(1000);

    await store.setRichEmbedPromise;

    expect(toJS(store.meta)).toEqual(fakeMeta);
    expect(richEmbedService.getMeta).toBeCalledWith(
      'http://www.minds.com/somelong/url?withparams=true&or=false',
    );
  });

  it('it should return null if there is no link', async () => {
    const fakeMeta = null;

    const promise = store.richEmbedCheck('hello minds');

    await promise;

    expect(toJS(store.meta)).toEqual(fakeMeta);
  });
});
