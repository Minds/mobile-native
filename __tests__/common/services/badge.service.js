import service from '../../../src/common/services/badge.service';
import push from '../../../src/common/services/push.service';
jest.mock('../../../src/common/services/push.service');
/**
 * Tests
 */
describe('Badge service', () => {
  it('should call launchCamera with null response and return', async () => {
    // call tested method

    expect(service.unreadNotifications).toEqual(0);

    service.setUnreadNotifications(10);
    expect(service.unreadNotifications).toEqual(10);
  });
});
