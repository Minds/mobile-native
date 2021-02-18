import { createClassStores, TLegacyStores } from './src/common/contexts';

let stores: any;

export const getStores = function (): TLegacyStores {
  if (!stores) {
    stores = createClassStores();
  }
  return stores;
};
