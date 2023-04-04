import boostedContentService from '../../../src/modules/boost/services/boosted-content.service';
import blockListService from '../../../src/common/services/block-list.service';
import sessionService from '../../../src/common/services/session.service';
import api from '../../../src/common/services/api.service';

jest.mock('../../../src/common/services/api.service');
jest.mock('../../../src/common/services/session.service');
jest.mock('../../../src/common/services/block-list.service');

/**
 * Tests
 */
describe('Boosted content service', () => {
  beforeEach(() => {
    blockListService.has.mockClear();
    sessionService.userLoggedIn = true;
    api.get.mockClear();
    boostedContentService.init();
  });

  it('should fetch the boosts from the server', async () => {
    blockListService.has.mockReturnValue(false);
    const fakeResponse = {
      boosts: [
        { entity: { guid: 1, ownerObj: { guid: 1 } } },
        { entity: { guid: 2, ownerObj: { guid: 2 } } },
        { entity: { guid: 3, ownerObj: { guid: 3 } } },
      ],
    };

    api.get.mockResolvedValue(fakeResponse);

    // should fetch the feed
    expect(api.get).toBeCalledWith('api/v3/boosts/feed', { location: 1 });
  });

  it('should fetch the boosts and filter blocked', async () => {
    blockListService.has
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(false)
      .mockReturnValueOnce(true)
      .mockReturnValueOnce(false);

    const fakeResponse = {
      boosts: [
        { entity: { guid: 1, ownerObj: { guid: 1 } } },
        { entity: { guid: 2, ownerObj: { guid: 2 } } },
        { entity: { guid: 3, ownerObj: { guid: 3 } } },
      ],
    };

    api.get.mockResolvedValue(fakeResponse);

    // load the boosts
    await boostedContentService.update();

    // blocked should be called
    expect(blockListService.has).toBeCalled();

    // the boosts should be stored in the boosts property
    expect(boostedContentService.boosts.length).toStrictEqual(2);
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
