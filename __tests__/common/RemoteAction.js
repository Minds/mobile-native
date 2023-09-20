import { Alert } from 'react-native';
import remoteAction from '../../src/common/RemoteAction';
import connectivityService from '../../src/common/services/connectivity.service';
import { ApiError, NetworkError } from '../../src/common/services/ApiErrors';

jest.mock('../../src/common/services/connectivity.service');

describe('remote action', () => {
  Alert.alert = jest.fn();

  beforeEach(() => {
    Alert.alert.mockClear();
    connectivityService.isConnected = true;
  });

  it('should not auto retry on generic error', async () => {
    const action = jest.fn();
    action.mockImplementation(async () => {
      throw new Error('boom');
    });

    await remoteAction(action);

    // should have been called
    expect(action).toHaveBeenCalledTimes(1);
  });

  it('should auto retry on net error', async () => {
    const action = jest.fn();
    action.mockImplementation(async () => {
      throw new NetworkError('Network request failed');
    });

    await remoteAction(action);

    // should have been called
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('should auto retry on net error n times', async () => {
    const action = jest.fn();

    action.mockImplementation(async () => {
      throw new NetworkError('Network request failed');
    });

    await remoteAction(action, '', 2);

    // should have been called
    expect(action).toHaveBeenCalledTimes(3);
  });

  it('should stop auto retry on success', async () => {
    const action = jest.fn();

    let tries = 0;

    action.mockImplementation(async () => {
      tries++;
      if (tries > 1) {
        return;
      }
      throw new NetworkError('Network request failed');
    });

    await remoteAction(action, '', 2);

    // should have been called
    expect(action).toHaveBeenCalledTimes(2);
  });

  it('should show offline error message', async () => {
    const action = jest.fn();

    action.mockImplementation(async () => {
      throw new NetworkError('Network request failed');
    });

    connectivityService.isConnected = false;

    await remoteAction(action, '', 0);

    // should have been called
    expect(action).toHaveBeenCalledTimes(1);

    // should call alert with the correct messages
    expect(Alert.alert.mock.calls[0][0]).toBe('Sorry!');
    expect(Alert.alert.mock.calls[0][1]).toBe('No Internet Connection');
    expect(Alert.alert.mock.calls[0][2][0].text).toBe('Ok');
    expect(Alert.alert.mock.calls[0][2][1].text).toBe('Try again');
  });

  it('should show api errors message', async () => {
    const action = jest.fn();

    action.mockImplementation(async () => {
      throw new ApiError('Some Error');
    });

    await remoteAction(action, '', 0);

    // should have been called
    expect(action).toHaveBeenCalledTimes(1);

    // should call alert with the correct messages
    expect(Alert.alert.mock.calls[0][0]).toBe('Sorry!');
    expect(Alert.alert.mock.calls[0][1]).toBe('Some Error');
    expect(Alert.alert.mock.calls[0][2][0].text).toBe('Ok');
    expect(Alert.alert.mock.calls[0][2][1].text).toBe('Try again');
  });

  it('should show error message with retry on failure', async () => {
    const action = jest.fn();

    action.mockImplementation(async () => {
      throw new NetworkError('Network request failed');
    });

    await remoteAction(action, '', 0);

    // should have been called
    expect(action).toHaveBeenCalledTimes(1);

    // should call alert with the correct messages
    expect(Alert.alert.mock.calls[0][0]).toBe('Sorry!');
    expect(Alert.alert.mock.calls[0][1]).toBe("Can't reach the server");
    expect(Alert.alert.mock.calls[0][2][0].text).toBe('Ok');
    expect(Alert.alert.mock.calls[0][2][1].text).toBe('Try again');
  });

  it('should call the action again if the user tap retry', async () => {
    const action = jest.fn();

    action.mockImplementation(async () => {
      throw new NetworkError('Network request failed');
    });

    await remoteAction(action, '', 0);

    // should have been called
    expect(action).toHaveBeenCalledTimes(1);

    Alert.alert.mock.calls[0][2][1].onPress();

    // should have been called again
    expect(action).toHaveBeenCalledTimes(2);
  });
});
