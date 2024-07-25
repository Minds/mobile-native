import { BoostedContentService } from '~/modules/boost/services/boosted-content.service';
import { BlockListService } from '~/common/services/block-list.service';
import { SessionService } from '~/common/services/session.service';
import { LogService } from '~/common/services/log.service';
import { Lifetime } from '~/services/injectionContainer';
import { FeedsService } from '~/common/services/feeds.service.ts';

jest.mock('~/common/services/feeds.service');
jest.mock('~/common/services/session.service');
jest.mock('~/common/services/block-list.service');
jest.mock('~/common/services/feeds.service');

import sp from '~/services/serviceProvider';

const feedService = new FeedsService();
feedService.setLimit.mockReturnThis();
feedService.setOffset.mockReturnThis();
feedService.setPaginated.mockReturnThis();
feedService.setDataProperty.mockReturnThis();
feedService.setEndpoint.mockReturnThis();
feedService.setParams.mockReturnThis();
const blockListService = new BlockListService();
sp.register('feed', () => feedService, Lifetime.Singleton);
sp.register('blockList', () => blockListService, Lifetime.Singleton);

/**
 * Tests
 */
describe('Boosted content service', () => {
  let boostedContentService, sessionService, logService;
  beforeEach(() => {
    sessionService = new SessionService();
    logService = new LogService();
    boostedContentService = new BoostedContentService(
      sessionService,
      logService,
    );
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
