import { gqlFetcher } from '~/common/services/api.service';
import { storages } from '~/common/services/storage/storages.service';
import { IS_TENANT } from '~/config/Config';
import {
  GetNavigationItemsDocument,
  GetNavigationItemsQuery,
  GetNavigationItemsQueryVariables,
  NavigationItemTypeEnum,
} from '~/graphql/api';
import { filterNavigationItems } from './helpers';

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
  customNavigation = storages.app.getMap('customNavigation');

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
    ?.filter(item => !tabsIds.includes(item.id) && item.visibleMobile)
    .sort((a, b) => (a.order > b.order ? 1 : -1))
    .map(item => ({ ...item, iconId: item.iconId.replace('_', '-') }));
};

/**
 * Returns the tab items
 */
export const useCustomNavigationTabs = () => {
  const nav = useCustomNavigation();

  if (!IS_TENANT) {
    return mindsTabs;
  }

  // hide main tab items
  return nav
    ?.filter(
      item =>
        tabsIds.includes(item.id) ||
        (item.type === NavigationItemTypeEnum.CustomLink &&
          item.url?.startsWith('tab#')),
    )
    .map(item => ({ ...item, iconId: item.iconId.replace('_', '-') }));
};

/**
 * Tabs used for minds app
 */
const mindsTabs = [
  {
    id: 'newsfeed',
    name: 'Newsfeed',
    type: NavigationItemTypeEnum.Core,
    action: null,
    iconId: 'home',
    order: 1,
    url: null,
    visible: true,
    visibleMobile: true,
    path: '/newsfeed',
  },
  {
    id: 'explore',
    name: 'Explore',
    type: NavigationItemTypeEnum.Core,
    action: null,
    iconId: 'tag',
    order: 2,
    url: null,
    visible: true,
    visibleMobile: true,
    path: '/discovery',
  },
  {
    id: 'groups',
    name: 'Groups',
    type: NavigationItemTypeEnum.Core,
    action: null,
    iconId: 'group',
    order: 4,
    url: null,
    visible: true,
    visibleMobile: true,
    path: '/groups',
  },
  {
    id: 'chat',
    name: 'Chat',
    type: NavigationItemTypeEnum.Core,
    action: null,
    iconId: 'chat_bubble',
    order: 5,
    url: null,
    visible: true,
    visibleMobile: true,
    path: '/chat/rooms',
  },
];
