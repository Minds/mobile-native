import { IS_TENANT } from '~/config/Config';
import {
  GetNavigationItemsDocument,
  GetNavigationItemsQuery,
  GetNavigationItemsQueryVariables,
} from '~/graphql/api';
import { filterNavigationItems } from './helpers';
import serviceProvider from '~/services/serviceProvider';
import { gqlFetcher } from '~/common/services/gqlFetcher';

const tabsIds = ['newsfeed', 'explore', 'chat', 'groups'];

export type CustomNavigationItems =
  | GetNavigationItemsQuery['customNavigationItems']
  | undefined;

export type CustomNavigationItem =
  GetNavigationItemsQuery['customNavigationItems'][0];

let customNavigation: CustomNavigationItems;

export function getCustomNavigation() {
  if (customNavigation || !IS_TENANT) {
    return customNavigation;
  }
  customNavigation = serviceProvider.storages.app.getObject('customNavigation');

  // if there is no data on the storage we fall back to the bundled config
  if (!customNavigation) {
    customNavigation = filterNavigationItems(
      require('~/modules/navigation/service/custom-navigation.json'),
    );
  }

  return customNavigation;
}

/**
 * Updates the custom navigation data on the storage
 */
export async function updateCustomNavigation() {
  try {
    const config = await fetchCustomNavigation();

    serviceProvider.storages.app.setObject('customNavigation', config);
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
    ?.filter(item => !tabsIds.includes(item.id) && item.visibleMobile)
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
