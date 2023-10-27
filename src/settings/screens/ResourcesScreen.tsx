import React from 'react';
import MenuSubtitle from '../../common/components/menus/MenuSubtitle';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import { Screen } from '../../common/ui';
import FitScrollView from '../../common/components/FitScrollView';
import { GOOGLE_PLAY_STORE } from '~/config/Config';
import { navigateToHelp } from '../SettingsScreen';
import openUrlService from '~/common/services/open-url.service';

type PropsType = {};

const items = [
  {
    id: 'about',
    options: [
      // {
      //   id: 'mobile',
      //   onPress: () => openUrlService.open('https://mobile.minds.com/mobile'),
      // },
      // {
      //   id: 'careers',
      //   onPress: () => openUrlService.open('https://jobs.lever.co/minds'),
      // },
      // {
      //   id: 'blog',
      //   onPress: () => openUrlService.open('https://www.minds.com/minds/blogs'),
      // },
      // {
      //   id: 'whitepaper',
      //   onPress: () =>
      //     openUrlService.open(
      //       'https://cdn-assets.minds.com/front/dist/browser/en/assets/documents/Minds-Whitepaper-v2.pdf',
      //     ),
      // },
      {
        id: 'rights',
        onPress: () =>
          openUrlService.open('https://www.minds.com/p/billofrights'),
      },
      // {
      //   id: 'events',
      //   onPress: () => openUrlService.open('https://change.minds.com/'),
      // },
      // {
      //   id: 'store',
      //   onPress: () => openUrlService.open('https://teespring.com/stores/minds'),
      // },
      {
        id: 'terms',
        onPress: () => openUrlService.open('https://www.minds.com/p/terms'),
      },
      {
        id: 'privacy',
        onPress: () => openUrlService.open('https://www.minds.com/p/privacy'),
      },
      // {
      //   id: 'content',
      //   onPress: () =>
      //     openUrlService.open('https://mobile.minds.com/content-policy'),
      // },
      {
        id: 'dmca',
        onPress: () => openUrlService.open('https://www.minds.com/p/dmca'),
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
        onPress: () => openUrlService.open('https://www.minds.com/p/contact'),
      },
      // {
      //   id: 'community',
      //   onPress: () =>
      //     openUrlService.open(
      //       'https://www.minds.com/groups/profile/100000000000000681',
      //     ),
      // },
      // {
      //   id: 'languages',
      //   onPress: () => openUrlService.open('https://mobile.minds.com/localization'),
      // },
      {
        id: 'status',
        onPress: () => openUrlService.open('https://status.minds.com/'),
      },
    ],
  },
  // {
  //   id: 'business',
  //   options: [
  //     {
  //       id: 'upgrade',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/upgrades'),
  //       show: false,
  //     },
  //     {
  //       id: 'token',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/token'),
  //     },
  //     {
  //       id: 'plus',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/plus'),
  //       show: false,
  //     },
  //     {
  //       id: 'pro',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/pro'),
  //       show: false,
  //     },
  //     {
  //       id: 'pay',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/pay'),
  //     },
  //     {
  //       id: 'nodes',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/nodes'),
  //     },
  //     {
  //       id: 'boost',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/boost'),
  //     },
  //     {
  //       id: 'rewards',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/rewards'),
  //     },
  //     {
  //       id: 'youtube',
  //       onPress: () =>
  //         openUrlService.open('https://mobile.minds.com/youtube-migration'),
  //     },
  //   ],
  // },
  // {
  //   id: 'developers',
  //   options: [
  //     {
  //       id: 'docs',
  //       onPress: () => openUrlService.open('https://developers.minds.com/'),
  //     },
  //     {
  //       id: 'community',
  //       onPress: () =>
  //         openUrlService.open(
  //           'https://mobile.minds.com/groups/profile/365903183068794880',
  //         ),
  //     },
  //     {
  //       id: 'code',
  //       onPress: () => openUrlService.open('https://gitlab.com/minds'),
  //     },
  //     {
  //       id: 'canary',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/canary'),
  //     },
  //     {
  //       id: 'branding',
  //       onPress: () => openUrlService.open('https://mobile.minds.com/branding'),
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
              {i18n.t(`settings.${item.id}.title`).toUpperCase()}
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
