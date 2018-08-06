
import service from '../../../src/common/services/deeplinks-router.service';
import { MINDS_DEEPLINK } from '../../../src/config/Config';
import navigationService from '../../../src/common/services/navigation.service';


jest.mock('../../../src/common/services/navigation.service');
/**
 * Tests
 */
describe('Deeplinks router service', () => {

  it('should add route', async () => {
    navigationService.get.mockReturnValue({
        navigate: jest.fn()
    });
    expect(service.routes.length).toBe(3)
    service.add('crypto', 'screen');
    expect(service.routes.length).toBe(4);
    service.navigate('crypto');
    
    expect(navigationService.get).toHaveBeenCalled();

    service.navigate('crypto2');

    expect(navigationService.get).toHaveBeenCalled();
    
  });
});