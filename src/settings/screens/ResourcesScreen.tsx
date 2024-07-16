import React from 'react';

import MenuSubtitle from '~/common/components/menus/MenuSubtitle';
import MenuItem from '~/common/components/menus/MenuItem';
import { Screen } from '~/common/ui';
import FitScrollView from '~/common/components/FitScrollView';
import { GOOGLE_PLAY_STORE } from '~/config/Config';
import { navigateToHelp } from '../SettingsScreen';
import sp from '~/services/serviceProvider';

type PropsType = {};

const items = [
  {
    id: 'about',
    options: [
      // {
      //   id: 'mobile',
      //   onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/mobile'),
      // },
      // {
      //   id: 'careers',
      //   onPress: () => sp.resolve('openURL').open('https://jobs.lever.co/minds'),
      // },
      // {
      //   id: 'blog',
      //   onPress: () => sp.resolve('openURL').open('https://www.minds.com/minds/blogs'),
      // },
      // {
      //   id: 'whitepaper',
      //   onPress: () =>
      //     sp.resolve('openURL').open(
      //       'https://cdn-assets.minds.com/front/dist/browser/en/assets/documents/Minds-Whitepaper-v2.pdf',
      //     ),
      // },
      {
        id: 'rights',
        onPress: () =>
          sp.resolve('openURL').open('https://www.minds.com/p/billofrights'),
      },
      // {
      //   id: 'events',
      //   onPress: () => sp.resolve('openURL').open('https://change.minds.com/'),
      // },
      // {
      //   id: 'store',
      //   onPress: () => sp.resolve('openURL').open('https://teespring.com/stores/minds'),
      // },
      {
        id: 'terms',
        onPress: () =>
          sp.resolve('openURL').open('https://www.minds.com/p/terms'),
      },
      {
        id: 'privacy',
        onPress: () =>
          sp.resolve('openURL').open('https://www.minds.com/p/privacy'),
      },
      // {
      //   id: 'content',
      //   onPress: () =>
      //     sp.resolve('openURL').open('https://mobile.minds.com/content-policy'),
      // },
      {
        id: 'dmca',
        onPress: () =>
          sp.resolve('openURL').open('https://www.minds.com/p/dmca'),
      },
    ],
  },
  {
    id: 'support',
    options: [
      {
        id: 'help',
        onPress: navigateToHelp,
      },
      {
        id: 'contact',
        onPress: () =>
          sp.resolve('openURL').open('https://www.minds.com/p/contact'),
      },
      // {
      //   id: 'community',
      //   onPress: () =>
      //     sp.resolve('openURL').open(
      //       'https://www.minds.com/groups/profile/100000000000000681',
      //     ),
      // },
      // {
      //   id: 'languages',
      //   onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/localization'),
      // },
      {
        id: 'status',
        onPress: () => sp.resolve('openURL').open('https://status.minds.com/'),
      },
    ],
  },
  // {
  //   id: 'business',
  //   options: [
  //     {
  //       id: 'upgrade',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/upgrades'),
  //       show: false,
  //     },
  //     {
  //       id: 'token',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/token'),
  //     },
  //     {
  //       id: 'plus',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/plus'),
  //       show: false,
  //     },
  //     {
  //       id: 'pro',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/pro'),
  //       show: false,
  //     },
  //     {
  //       id: 'pay',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/pay'),
  //     },
  //     {
  //       id: 'nodes',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/nodes'),
  //     },
  //     {
  //       id: 'boost',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/boost'),
  //     },
  //     {
  //       id: 'rewards',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/rewards'),
  //     },
  //     {
  //       id: 'youtube',
  //       onPress: () =>
  //         sp.resolve('openURL').open('https://mobile.minds.com/youtube-migration'),
  //     },
  //   ],
  // },
  // {
  //   id: 'developers',
  //   options: [
  //     {
  //       id: 'docs',
  //       onPress: () => sp.resolve('openURL').open('https://developers.minds.com/'),
  //     },
  //     {
  //       id: 'community',
  //       onPress: () =>
  //         sp.resolve('openURL').open(
  //           'https://mobile.minds.com/groups/profile/365903183068794880',
  //         ),
  //     },
  //     {
  //       id: 'code',
  //       onPress: () => sp.resolve('openURL').open('https://gitlab.com/minds'),
  //     },
  //     {
  //       id: 'canary',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/canary'),
  //     },
  //     {
  //       id: 'branding',
  //       onPress: () => sp.resolve('openURL').open('https://mobile.minds.com/branding'),
  //     },
  //   ],
  // },
] as const;

type Items = typeof items[number];
type Options<T extends number> = typeof items[T]['options'][number] & {
  show?: boolean;
};

const ResourcesScreen = ({}: PropsType) => {
  const shouldHideCash = GOOGLE_PLAY_STORE;
  return (
    <Screen>
      <FitScrollView>
        {items.map((item: Items, index) => (
          <React.Fragment key={item.id}>
            <MenuSubtitle>
              {sp.i18n.t(`settings.${item.id}.title`).toUpperCase()}
            </MenuSubtitle>
            {item.options.map((option: Options<typeof index>, i) =>
              !shouldHideCash || option.show !== false ? (
                <MenuItem
                  key={`${item.id}.${option.id}`}
                  // @ts-ignore
                  title={i18n.t(`settings.${item.id}.${option.id}`)}
                  onPress={option.onPress}
                  noBorderTop={i > 0}
                />
              ) : null,
            )}
          </React.Fragment>
        ))}
      </FitScrollView>
    </Screen>
  );
};

export default ResourcesScreen;
