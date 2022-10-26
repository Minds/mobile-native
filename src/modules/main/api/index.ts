import { ApiConnector, to } from 'services/api';

// import { getSubscriptionsAndBalances } from 'app/sdk/subscriptions';
export async function login({
  username,
  passcode,
}: {
  username?: string;
  passcode?: string;
}): Promise<unknown> {
  const [response] = await to(
    ApiConnector.getInstance()
      .post('/v1/login', {
        username,
        passcode,
        scope: 'subscription:read',
      })
      .then(result => result.data),
  );
  return response;
}

export async function registeredDevice({
  username,
  passcode,
}: {
  username?: string;
  passcode?: string;
}): Promise<boolean> {
  const response = await ApiConnector.getInstance()
    .post('/v1/verifications/registeredDevice', {
      username,
      passcode,
    })
    .then(resp => resp.status === 200)
    .catch(() => false);
  return !!response;
}

export async function requestOtpForDeviceChange(): Promise<unknown> {
  const [response] = await to(
    ApiConnector.getInstance()
      .post('/v1/devices/verification', {})
      .then(result => result.data),
  );
  return response;
}

export async function verifyOtpForDeviceChange({
  verificationId,
  otp,
}: {
  verificationId?: string;
  otp?: string;
}): Promise<unknown> {
  const [response] = await to(
    ApiConnector.getInstance()
      .post(`/v1/devices/verification/${verificationId}`, { otp })
      .then(result => result.data),
  );
  return response;
}
// end-of-api-methods - HYGEN
