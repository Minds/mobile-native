
import service from '../../../src/common/services/session.storage.service';

import {AsyncStorage} from 'react-native';


jest.mock('react-native', () => ({
  AsyncStorage: {        

      setItem: jest.fn((item, value) => {
          return new Promise((resolve, reject) => {        
              resolve(value);
          });
      }),
      multiSet:  jest.fn((item, value) => {
          return new Promise((resolve, reject) => {
              resolve(value);
          });
      }),
      getItem: jest.fn((item, value) => {
          return new Promise((resolve, reject) => {
              resolve(value);
          });
      }),
      multiGet: jest.fn((item) => {
          return new Promise((resolve, reject) => {
              resolve();
          });
      }),
      removeItem: jest.fn((item) => {
          return new Promise((resolve, reject) => {
              resolve();
          });
      }),
      getAllKeys: jest.fn((items) => {
          return new Promise((resolve) => {
              resolve();
          });
      })
    }
  })
);
  
/**
 * Tests
 */
describe('Session storage service', () => {
  
  it('should set and get initial values', async () => {
    
    await service.setAccessToken('token', '1111');

    expect(AsyncStorage.setItem).toHaveBeenCalled();

    await service.getAccessToken();

    expect(AsyncStorage.getItem).toHaveBeenCalled();

    await service.getPrivateKey();

    expect(AsyncStorage.getItem).toHaveBeenCalled();
  });
});