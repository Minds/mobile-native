import { storages } from '~/common/services/storage/storages.service';

export { ApiConnector, to } from './apiConnector';
export type { RefreshTokenResponse } from './types';

export const rehydrateData = (tag: string) => async () => {
  try {
    return JSON.parse(
      (await storages.api?.getStringAsync(tag)) ?? '{}',
    ) as Record<string, unknown>;
  } catch (error) {}
};

export const persistData = (tag: string) => (item: Record<string, unknown>) =>
  rehydrateData(tag)().then((data = {}) =>
    storages.api
      ?.setStringAsync(tag, JSON.stringify({ ...data, ...item }))
      .then(() => ({
        ...data,
        ...item,
      })),
  );

export const clearData = (tag: string) => () => storages.api?.removeItem(tag);
