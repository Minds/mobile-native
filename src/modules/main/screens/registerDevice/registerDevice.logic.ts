import React, { useRef } from 'react';
import { ApiConnector } from 'services/api';
import { WrapperHandle } from '~/components';
import { requestOtpForDeviceChange, verifyOtpForDeviceChange } from '../../api';

export type BasicLoginParams = {
  username: string;
  passcode: string;
  mockedDeviceKey: string;
};

export type VerifyOtpParams = {
  otp: string;
  verificationId: string;
};

type RequestOtpForDeviceChangeHook = {
  requestOtp: () => Promise<string>;
  wrapperHandle: React.RefObject<WrapperHandle>;
};
type VerifyOtpForDeviceChangeHook = {
  verifyOtp: (params: VerifyOtpParams) => Promise<string>;
  wrapperHandle: React.RefObject<WrapperHandle>;
};
type RequestOtpData = {
  verificationId: string;
};

type VerifyOtpData = {
  partyKey: string;
};

export function useRequestOtpForDeviceChange(): RequestOtpForDeviceChangeHook {
  const wrapperHandle = useRef<WrapperHandle>(null);

  const requestOtp = async () => {
    wrapperHandle?.current?.loadingStart();
    ApiConnector.getInstance().updateHeaders({
      'Content-Type': 'application/json',
    });
    const { verificationId = '' } =
      ((await requestOtpForDeviceChange()) as RequestOtpData) || {};
    wrapperHandle?.current?.loadingStop();
    return verificationId;
  };
  return { requestOtp, wrapperHandle };
}

export function useVerifyOtpForDeviceChange(): VerifyOtpForDeviceChangeHook {
  const wrapperHandle = useRef<WrapperHandle>(null);
  const verifyOtp = async (params: VerifyOtpParams) => {
    const { otp, verificationId } = params;
    wrapperHandle?.current?.loadingStart();
    ApiConnector.getInstance().updateHeaders({
      'Content-Type': 'application/json',
    });
    const { partyKey = '' } =
      ((await verifyOtpForDeviceChange({
        otp,
        verificationId,
      })) as VerifyOtpData) || {};
    wrapperHandle?.current?.loadingStop();
    return partyKey;
  };
  return { verifyOtp, wrapperHandle };
}
