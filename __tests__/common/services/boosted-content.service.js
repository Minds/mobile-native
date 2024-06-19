import boostedContentService from '../../../src/modules/boost/services/boosted-content.service';
import blockListService from '../../../src/common/services/block-list.service';
import { sessionService } from '~/common/services';

jest.mock('../../../src/common/services/feeds.service');
jest.mock('../../../src/common/services/session.service');
jest.mock('../../../src/common/services/block-list.service');

/**
 * Tests
 */
describe('Boosted content service', () => {
  beforeEach(() => {
    blockListService.has.mockClear();
    sessionService.userLoggedIn = true;
    boostedContentService.init();
  });

  it('should fetch the boosts from the server', async () => {
    blockListService.has.mockReturnValue(false);
    const fakeBoosts = [
      { guid: 1, ownerObj: { guid: 1 } },
      { guid: 2, ownerObj: { guid: 2 } },
      { guid: 3, ownerObj: { guid: 3 } },
    ];
    const result = fakeBoosts.map(e => {
      e.boosted = true;
      return e;
    });

    boostedContentService.feedsService.getEntities.mockResolvedValue(
      fakeBoosts,
    );
    boostedContentService.feedsService.fetchLocal.mockResolvedValue(true);

    // load the boosts
    await boostedContentService.load();

    // should fetch the feed
    expect(boostedContentService.feedsService.setEndpoint).toBeCalledWith(
      'api/v3/boosts/feed',
    );
    expect(boostedContentService.feedsService.setOffset).toBeCalledWith(0);
    expect(boostedContentService.feedsService.setLimit).toBeCalledWith(24);
    expect(boostedContentService.feedsService.fetchLocal).toBeCalled();

    // should fetch the boosts entities
    expect(boostedContentService.feedsService.getEntities).toBeCalled();

    // the boosts should be stored in the boosts property
    expect(boostedContentService.boosts).toStrictEqual(result);
  });

  it('should fetch the boosts and filter blocked', async () => {
    blockListService.has
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const fakeBoosts = [
      { guid: 1, ownerObj: { guid: 1 } },
      { guid: 2, ownerObj: { guid: 2 } },
      { guid: 3, ownerObj: { guid: 3 } },
    ];

    const result = fakeBoosts
      .map(e => {
        e.boosted = true;
        return e;
      })
      .filter(e => e.guid !== 2);

    boostedContentService.feedsService.getEntities.mockResolvedValue(
      fakeBoosts,
    );
    boostedContentService.feedsService.fetchLocal.mockResolvedValue(true);

    // load the boosts
    await boostedContentService.load();

    // should fetch the feed
    expect(boostedContentService.feedsService.setEndpoint).toBeCalledWith(
      'api/v3/boosts/feed',
    );
    expect(boostedContentService.feedsService.setOffset).toBeCalledWith(0);
    expect(boostedContentService.feedsService.setLimit).toBeCalledWith(24);
    expect(boostedContentService.feedsService.fetchLocal).toBeCalled();

    // blocked should be called
    expect(blockListService.has).toBeCalled();

    // should fetch the boosts entities
    expect(boostedContentService.feedsService.getEntities).toBeCalled();

    // the boosts should be stored in the boosts property
    expect(boostedContentService.boosts).toStrictEqual(result);
  });

  it('should return next boost and start again when the end is reached', () => {
    const fakeBoosts = [{ guid: 1 }, { guid: 2 }, { guid: 3 }];

    blockListService.has.mockReturnValue(false);

    boostedContentService.boosts = fakeBoosts;

    // next
    expect(boostedContentService.fetch()).toBe(fakeBoosts[0]);
    // next
    expect(boostedContentService.fetch()).toBe(fakeBoosts[1]);
    // next
    expect(boostedContentService.fetch()).toBe(fakeBoosts[2]);
    // start again
    expect(boostedContentService.fetch()).toBe(fakeBoosts[0]);
  });
});
