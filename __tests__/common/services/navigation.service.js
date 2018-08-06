
import service from '../../../src/common/services/navigation.service';
/**
 * Tests
 */
describe('Navigation service', () => {
  it('should push notifs', async () => {
    navigationStore = {};
    
    expect(function(){
      service.get()
    }).toThrowError();
    
    service.set(navigationStore);

    expect(service.get()).toEqual(navigationStore);
  });
});