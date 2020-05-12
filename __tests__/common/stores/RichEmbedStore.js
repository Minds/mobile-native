import { toJS } from 'mobx';

import RichEmbedStore from '../../../src/common/stores/RichEmbedStore';
import RichEmbedService from '../../../src/common/services/rich-embed.service';

jest.mock('../../../src/common/services/rich-embed.service');

/**
 * Tests
 */
describe('rich embed store', () => {
  let store;

  beforeEach(() => {
    store = new RichEmbedStore();
    RichEmbedService.getMeta.mockClear();
  });

  it('it should return metadata from links without protocol', async (done) => {
    const fakeMeta = {
      meta: {
        title: 'Minds',
        description: 'The crypto social network',
        url: 'www.minds.com',
      },
    };

    RichEmbedService.getMeta.mockResolvedValue(fakeMeta);

    try {
      const promise = store.richEmbedCheck('hello www.minds.com');

      await promise;

      jest.runTimersToTime(1000);

      await store.setRichEmbedPromise;

      expect(toJS(store.meta)).toEqual(fakeMeta);
      expect(RichEmbedService.getMeta).toBeCalledWith('https://www.minds.com');
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('it should return metadata from links with protocol', async (done) => {
    const fakeMeta = {
      meta: {
        title: 'Minds with protocol',
        description: 'The crypto social network',
        url: 'www.minds.com',
      },
    };

    RichEmbedService.getMeta.mockResolvedValue(fakeMeta);

    try {
      const promise = store.richEmbedCheck(
        'hello https://www.minds.com/somelong/url?withparams=true&or=false',
      );

      await promise;

      jest.runTimersToTime(1000);

      await store.setRichEmbedPromise;

      expect(toJS(store.meta)).toEqual(fakeMeta);
      expect(RichEmbedService.getMeta).toBeCalledWith(
        'https://www.minds.com/somelong/url?withparams=true&or=false',
      );
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('it should return metadata from links with protocol http', async (done) => {
    const fakeMeta = {
      meta: {
        title: 'Minds with protocol',
        description: 'The crypto social network',
        url: 'www.minds.com',
      },
    };

    RichEmbedService.getMeta.mockResolvedValue(fakeMeta);

    try {
      const promise = store.richEmbedCheck(
        'hello http://www.minds.com/somelong/url?withparams=true&or=false',
      );

      await promise;

      jest.runTimersToTime(1000);

      await store.setRichEmbedPromise;

      expect(toJS(store.meta)).toEqual(fakeMeta);
      expect(RichEmbedService.getMeta).toBeCalledWith(
        'http://www.minds.com/somelong/url?withparams=true&or=false',
      );
      done();
    } catch (e) {
      done.fail(e);
    }
  });

  it('it should return null if there is no link', async (done) => {
    const fakeMeta = null;

    try {
      const promise = store.richEmbedCheck('hello minds');

      await promise;

      expect(toJS(store.meta)).toEqual(fakeMeta);
      done();
    } catch (e) {
      done.fail(e);
    }
  });
});
