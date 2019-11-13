import boostedContentService from "../../../src/common/services/boosted-content.service";
import FeedsService from "../../../src/common/services/feeds.service";

jest.mock('../../../src/common/services/feeds.service');
jest.mock('../../../src/common/services/session.service');

/**
 * Tests
 */
describe('Boosted content service', () => {

  it('should fetch the boosts from the server', async () => {

    const fakeBoosts = [{guid: 1}, {guid: 2}, {guid: 3}];

    boostedContentService.feedsService.getEntities.mockResolvedValue(fakeBoosts);
    boostedContentService.feedsService.fetchLocal.mockResolvedValue(true);

    // load the boosts
    await boostedContentService.load();

    // should fetch the feed
    expect(boostedContentService.feedsService.setEndpoint).toBeCalledWith('api/v2/boost/feed');
    expect(boostedContentService.feedsService.setOffset).toBeCalledWith(0);
    expect(boostedContentService.feedsService.setLimit).toBeCalledWith(12);
    expect(boostedContentService.feedsService.fetchLocal).toBeCalled();

    // should fetch the boosts entities
    expect(boostedContentService.feedsService.getEntities).toBeCalled();

    // the boosts should be stored in the boosts property
    expect(boostedContentService.boosts).toBe(fakeBoosts);
  });

  it('should return next boost and start again when the end is reached', () => {

    const fakeBoosts = [{guid: 1}, {guid: 2}, {guid: 3}];

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