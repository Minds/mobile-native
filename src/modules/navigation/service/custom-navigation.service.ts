import { gqlFetcher } from '~/common/services/api.service';
import { storages } from '~/common/services/storage/storages.service';
import { IS_TENANT } from '~/config/Config';
import {
  GetNavigationItemsDocument,
  GetNavigationItemsQuery,
  GetNavigationItemsQueryVariables,
} from '~/graphql/api';
import { filterNavigationItems } from './helpers';

const tabsIds = ['newsfeed', 'explore', 'chat'];

let customNavigation: GetNavigationItemsQuery['customNavigationItems'];

export function getCustomNavigation() {
  if (customNavigation || !IS_TENANT) {
    return customNavigation;
  }
  customNavigation = storages.app.getMap('customNavigation');

  if (!customNavigation) {
    customNavigation = require('~/modules/navigation/service/custom-navigation.json');
  }

  return customNavigation;
}

/**
 * Updates the custom navigation data on the storage
 */
export async function updateCustomNavigation() {
  try {
    const config = await fetchCustomNavigation();

    storages.app.setMap('customNavigation', config);
  } catch (error) {
    console.error('Failed to fetch custom navigation', error);
  }
}

export async function fetchCustomNavigation() {
  const config = await gqlFetcher<
    GetNavigationItemsQuery,
    GetNavigationItemsQueryVariables
  >(GetNavigationItemsDocument)();

  return filterNavigationItems(config.customNavigationItems);
}

/**
 * Returns the custom navigation items
 */
export const useCustomNavigation = () => {
  return getCustomNavigation();
};

/**
 * Returns the menu items that are not part of the main tabs
 */
export const useCustomNavigationMenu = () => {
  const nav = useCustomNavigation();

  // hide main tab items
  return nav
    ?.filter(item => !tabsIds.includes(item.id))
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    .map(item => ({ ...item, iconId: item.iconId.replace('_', '-') }));
};

/**
 * Returns the tab items
 */
export const useCustomNavigationTabs = () => {
  const nav = useCustomNavigation();

  // hide main tab items
  return nav
    ?.filter(item => tabsIds.includes(item.id))
    .map(item => ({ ...item, iconId: item.iconId.replace('_', '-') }));
};
