import React from 'react';
import { Linking, ScrollView } from 'react-native';
import MenuSubtitle from '../../common/components/menus/MenuSubtitle';
import MenuItem from '../../common/components/menus/MenuItem';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';

type PropsType = {};

const items = [
  {
    id: 'about',
    options: [
      {
        id: 'mobile',
        onPress: () => Linking.openURL('https://mobile.minds.com/mobile'),
      },
      {
        id: 'careers',
        onPress: () => Linking.openURL('https://jobs.lever.co/minds'),
      },
      {
        id: 'blog',
        onPress: () => Linking.openURL('https:/mobile.minds.com/minds/blogs'),
      },
      {
        id: 'whitepaper',
        onPress: () =>
          Linking.openURL(
            'https://cdn-assets.minds.com/front/dist/browser/en/assets/documents/Minds-Whitepaper-v2.pdf',
          ),
      },
      {
        id: 'rights',
        onPress: () =>
          Linking.openURL('https:/mobile.minds.com/p/billofrights'),
      },
      {
        id: 'events',
        onPress: () => Linking.openURL('https://change.minds.com/'),
      },
      {
        id: 'store',
        onPress: () => Linking.openURL('https://teespring.com/stores/minds'),
      },
      {
        id: 'terms',
        onPress: () => Linking.openURL('https://mobile.minds.com/p/terms'),
      },
      {
        id: 'privacy',
        onPress: () => Linking.openURL('https://mobile.minds.com/p/privacy'),
      },
      {
        id: 'content',
        onPress: () =>
          Linking.openURL('https://mobile.minds.com/content-policy'),
      },
      {
        id: 'dmca',
        onPress: () => Linking.openURL('https://mobile.minds.com/p/dmca'),
      },
    ],
  },
  {
    id: 'support',
    options: [
      {
        id: 'help',
        onPress: () => Linking.openURL('https://mobile.minds.com/help'),
      },
      {
        id: 'contact',
        onPress: () => Linking.openURL('https:/mobile.minds.com/p/contact'),
      },
      {
        id: 'community',
        onPress: () =>
          Linking.openURL(
            'https://mobile.minds.com/groups/profile/100000000000000681',
          ),
      },
      {
        id: 'languages',
        onPress: () => Linking.openURL('https://mobile.minds.com/localization'),
      },
      {
        id: 'status',
        onPress: () => Linking.openURL('https://status.minds.com/'),
      },
    ],
  },
  {
    id: 'business',
    options: [
      {
        id: 'upgrade',
        onPress: () => Linking.openURL('https://mobile.minds.com/upgrades'),
      },
      {
        id: 'token',
        onPress: () => Linking.openURL('https://mobile.minds.com/token'),
      },
      {
        id: 'plus',
        onPress: () => Linking.openURL('https://mobile.minds.com/plus'),
      },
      {
        id: 'pro',
        onPress: () => Linking.openURL('https://mobile.minds.com/pro'),
      },
      {
        id: 'pay',
        onPress: () => Linking.openURL('https://mobile.minds.com/pay'),
      },
      {
        id: 'nodes',
        onPress: () => Linking.openURL('https://mobile.minds.com/nodes'),
      },
      {
        id: 'boost',
        onPress: () => Linking.openURL('https://mobile.minds.com/boost'),
      },
      {
        id: 'rewards',
        onPress: () => Linking.openURL('https://mobile.minds.com/rewards'),
      },
      {
        id: 'youtube',
        onPress: () =>
          Linking.openURL('https://mobile.minds.com/youtube-migration'),
      },
    ],
  },
  {
    id: 'developers',
    options: [
      {
        id: 'docs',
        onPress: () => Linking.openURL('https://developers.minds.com/'),
      },
      {
        id: 'community',
        onPress: () =>
          Linking.openURL(
            'https://mobile.minds.com/groups/profile/365903183068794880',
          ),
      },
      {
        id: 'code',
        onPress: () => Linking.openURL('https://gitlab.com/minds'),
      },
      {
        id: 'canary',
        onPress: () => Linking.openURL('https://mobile.minds.com/canary'),
      },
      {
        id: 'branding',
        onPress: () => Linking.openURL('https://mobile.minds.com/branding'),
      },
    ],
  },
] as const;

type Items = typeof items[number];
type Options<T extends number> = typeof items[T]['options'][number];

const ResourcesScreen = ({}: PropsType) => {
  return (
    <ScrollView style={styles.container}>
      {items.map((item: Items, index) => (
        <>
          <MenuSubtitle>
            {i18n.t(`settings.${item.id}.title`).toUpperCase()}
          </MenuSubtitle>
          {item.options.map((option: Options<typeof index>, i) => (
            <MenuItem
              item={{
                //@ts-ignore TODO: solve this nested type error
                title: i18n.t(`settings.${item.id}.${option.id}`),
                onPress: option.onPress,
                noIcon: true,
              }}
              containerItemStyle={
                i > 0 ? ThemedStyles.style.borderTop0x : undefined
              }
            />
          ))}
        </>
      ))}
    </ScrollView>
  );
};

const styles = ThemedStyles.create({
  container: ['flexContainer', 'bgPrimaryBackground'],
});

export default ResourcesScreen;
