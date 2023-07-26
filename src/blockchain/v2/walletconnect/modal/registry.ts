const registry = require('./wallets.json');
import {
  IMobileRegistryEntry,
  IAppRegistry,
  IAppEntry,
} from '@walletconnect/types';

function formatMobileRegistryEntry(entry: IAppEntry): IMobileRegistryEntry {
  return {
    name: entry.name || '',
    shortName: entry.metadata.shortName || '',
    color: entry.metadata.colors.primary || '',
    logo: entry.id ? getAppLogoUrl(entry.id) : '',
    universalLink: entry.mobile.universal || '',
    deepLink: entry.mobile.native || '',
  };
}

function formatMobileRegistry(registry: IAppRegistry): IMobileRegistryEntry[] {
  return Object.values<any>(registry)
    .filter(entry => !!entry.mobile.universal || !!entry.mobile.native)
    .map(formatMobileRegistryEntry);
}

function getAppLogoUrl(id): string {
  return 'https://registry.walletconnect.org/logo/md/' + id + '.jpeg';
}

const formattedRegistry = formatMobileRegistry(registry);

export const Wallets: IMobileRegistryEntry[] = formattedRegistry.slice(0, 6);
