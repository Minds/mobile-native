import navigationService from '../../../src/navigation/NavigationService';
import service from '../../../src/common/services/deeplinks-router.service';

/**
 * Tests
 */
describe('Deeplinks router service', () => {
  navigationService.navigate = jest.fn();

  beforeEach(() => {
    navigationService.navigate.mockClear();
  });

  it('should add route', async () => {
    service.clearRoutes();
    expect(service.routes.length).toBe(0);
    service.add('crypto/:someparam', 'screen1');
    service.add('myurl/:someparam1', 'screen2');
    service.add('twoparams/:someparam1/:someparam2', 'screen2');
    expect(service.routes.length).toBe(3);
    service.navigate('http://www.minds.com/crypto/somevalue');
    expect(navigationService.navigate).toHaveBeenCalledWith('screen1', {
      someparam: 'somevalue',
    });
    service.navigate('http://www.minds.com/myurl/somevalue');
    expect(navigationService.navigate).toHaveBeenCalledWith('screen2', {
      someparam1: 'somevalue',
    });
    service.navigate('http://www.minds.com/twoparams/somevalue/somevalue1');
    expect(navigationService.navigate).toHaveBeenCalledWith('screen2', {
      someparam1: 'somevalue',
      someparam2: 'somevalue1',
    });
    service.navigate(
      'http://www.minds.com/twoparams/somevalue/somevalue1?other=1&other2=2',
    );
    expect(navigationService.navigate).toHaveBeenCalledWith('screen2', {
      someparam1: 'somevalue',
      someparam2: 'somevalue1',
      other: '1',
      other2: '2',
    });
    service.navigate('http://www.minds.com/myurl/somevalue?other=1');
    expect(navigationService.navigate).toHaveBeenCalledWith('screen2', {
      someparam1: 'somevalue',
      other: '1',
    });
  });
});
