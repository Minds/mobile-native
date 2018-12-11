
import service from '../../../src/common/services/deeplinks-router.service';
import { MINDS_DEEPLINK } from '../../../src/config/Config';
import navigationService from '../../../src/navigation/NavigationService';


/**
 * Tests
 */
describe('Deeplinks router service', () => {
  navigationService.navigate = jest.fn();


  beforeEach(() => {
    navigationService.navigate.mockClear();
  });

  it('should add route', async () => {
    expect(service.routes.length).toBe(10)
    service.add('crypto/:someparam', 'screen1');
    service.add('myurl/:someparam1', 'screen2');
    expect(service.routes.length).toBe(12);
    service.navigate('http://www.minds.com/crypto/somevalue');
    expect(navigationService.navigate).toHaveBeenCalledWith('screen1', {someparam: 'somevalue'});
    service.navigate('http://www.minds.com/myurl/somevalue');
    expect(navigationService.navigate).toHaveBeenCalledWith('screen2', {someparam1: 'somevalue'});
  });
});