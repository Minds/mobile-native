import React from 'react';
import { ApiConnector } from 'services/api';
import { WrapperHandle } from '~/components';
import { login, registeredDevice } from '../../api';
import { useRef, useEffect, useState, useCallback } from 'react';
// import appStorage from 'services/appStorage';
// import { uuid } from 'utils/.';
import { useFocusEffect } from '@react-navigation/native';

export type BasicLoginParams = {
  username: string;
  passcode: string;
  deviceKey: string;
};

export type VerifyOtpParams = {
  otp: string;
  verificationId: string;
};

type DeviceLoginHook = {
  deviceLogin: (params: BasicLoginParams) => Promise<boolean>;
};

type RegisterDeviceHook = {
  checkDeviceAvailability: (params: BasicLoginParams) => Promise<boolean>;
  wrapperHandle: React.RefObject<WrapperHandle>;
};

type GetCredentialsHook = {
  deviceKey: string;
  partyKey: string | null;
  isNewDevice: boolean;
};

type LoginData = {
  partyKey: string;
  availableSubscriptions: Array<{ subscriptionKey: string }>;
};

export function useDeviceLogin(): DeviceLoginHook {
  const deviceLogin = async (params: BasicLoginParams) => {
    const { username, passcode, deviceKey } = params;
    ApiConnector.getInstance().updateHeaders({ 'X-DeviceKey': deviceKey });
    const { partyKey = '', availableSubscriptions = [] } =
      ((await login({ username, passcode })) as LoginData) || {};
    if (partyKey && availableSubscriptions.length > 0) {
      return true;
    }
    return false;
  };
  return { deviceLogin };
}

export function useRegisterDevice(): RegisterDeviceHook {
  const wrapperHandle = useRef<WrapperHandle>(null);
  const checkDeviceAvailability = async (params: BasicLoginParams) => {
    const { username, passcode, deviceKey } = params;
    wrapperHandle?.current?.loadingStart();
    ApiConnector.getInstance().updateHeaders({ 'X-DeviceKey': deviceKey });
    const response = (await registeredDevice({ username, passcode })) || false;
    wrapperHandle?.current?.loadingStop();
    return response;
  };
  return { checkDeviceAvailability, wrapperHandle };
}

export function useGetCredentials(reset?: () => void): GetCredentialsHook {
  const [deviceKey, setDeviceKey] = useState<string>('');
  const [partyKey, setPartyKey] = useState<string | null>(null);
  const [isNewDevice, setIsNewDevice] = useState<boolean>(false);

  const requestPartyKey = async () => {
    const partyKey = '';
    setIsNewDevice(!partyKey);
    setPartyKey(partyKey);
  };

  const requestDeviceKey = useCallback(async () => {
    setDeviceKey('');
  }, []);

  useEffect(() => {
    requestDeviceKey();
    requestPartyKey();
  }, [requestDeviceKey, reset]);

  useFocusEffect(
    useCallback(() => {
      requestDeviceKey();
      requestPartyKey();
    }, [requestDeviceKey]),
  );

  return { deviceKey, partyKey, isNewDevice };
}
