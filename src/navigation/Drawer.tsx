import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFo from 'react-native-vector-icons/Feather';
import IconFa from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'react-native-elements';

import testID from '../common/helpers/testID';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import abbrev from '../common/helpers/abbrev';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';
import { IS_FROM_STORE } from '../config/Config';

const ICON_SIZE = 23;

const getOptionsList = (navigation) => {
  const theme = ThemedStyles.style;

  let list = [
    /* Removed as per request in https://gitlab.com/minds/mobile-native/issues/1886
    {
      name: i18n.t('moreScreen.helpSupport'),
      icon: (<Icon name='help-outline' size={ICON_SIZE} style={ theme.colorIcon }/>),
      onPress: () => {
        this.props.navigation.push('GroupView', { guid: '100000000000000681'});
      }
    },
    {
      name: i18n.t('moreScreen.invite'),
      icon: (<Icon name='share' size={ICON_SIZE} style={ theme.colorIcon }/>),
      onPress: () => {
        shareService.invite(this.props.user.me.guid);
      }
    },
    */
    {
      name: i18n.t('newsfeed.title'),
      icon: (
        <Icon
          name="home"
          size={ICON_SIZE - 4}
          style={[theme.colorIcon, styles.icon]}
        />
      ),
      onPress: () => {
        navigation.navigate('Newsfeed');
      },
    },
    !IS_FROM_STORE
      ? {
          name: i18n.t('discovery.title'),
          icon: (
            <IconFo
              name="hash"
              size={ICON_SIZE - 4}
              style={[theme.colorIcon, styles.icon]}
            />
          ),
          onPress: () => {
            navigation.navigate('Discovery');
          },
        }
      : null,
    featuresService.has('plus-2020') && !IS_FROM_STORE
      ? {
          name: i18n.t('wire.lock.plus'),
          icon: (
            <Icon
              name="add-to-queue"
              size={ICON_SIZE - 4}
              style={[theme.colorIcon, styles.icon]}
            />
          ),
          onPress: () => {
            navigation.navigate('Tabs', {
              screen: 'CaptureTab',
              params: { screen: 'PlusDiscoveryScreen' },
            });
          },
        }
      : null,
    {
      name: i18n.t('discovery.groups'),
      icon: (
        <IconFa
          name="users"
          size={ICON_SIZE - 4}
          style={[theme.colorIcon, styles.icon]}
        />
      ),
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'CaptureTab',
          params: { screen: 'GroupsList' },
        });
      },
    },
  ];

  if (featuresService.has('crypto')) {
    list = [
      ...list,
      {
        name: i18n.t('moreScreen.wallet'),
        icon: (
          <IconFa
            name="coins"
            size={ICON_SIZE}
            style={[theme.colorIcon, styles.icon]}
          />
        ),
        onPress: () => {
          navigation.navigate('Tabs', {
            screen: 'CaptureTab',
            params: { screen: 'Wallet' },
          });
        },
      },
    ];
  }

  list = [
    ...list,
    {
      name: 'Analytics',
      icon: (
        <Icon
          name="analytics"
          size={ICON_SIZE}
          style={[theme.colorIcon, styles.icon]}
        />
      ),

      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'CaptureTab',
          params: { screen: 'Analytics' },
        });
      },
    },
    {
      name: i18n.t('moreScreen.settings'),
      icon: (
        <Icon
          name="settings"
          size={ICON_SIZE}
          style={[theme.colorIcon, styles.icon]}
        />
      ),
      onPress: () => {
        navigation.navigate('Tabs', {
          screen: 'CaptureTab',
          params: { screen: 'Settings' },
        });
      },
    },
  ];

  return list;
};

/**
 * Drawer menu
 * @param props
 */
export default function Drawer(props) {
  const channel = sessionService.getUser();

  const navToSubscribers = () => {
    props.navigation.push('Subscribers', {
      guid: channel.guid,
    });
  };

  const navToSubscriptions = () => {
    props.navigation.push('Subscribers', {
      guid: channel.guid,
      filter: 'subscriptions',
    });
  };

  const navToChannel = () => {
    props.navigation.closeDrawer();
    props.navigation.push('Channel', { entity: channel });
  };

  const theme = ThemedStyles.style;
  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  const subscribersStyle = [
    theme.subTitleText,
    theme.colorTertiaryText,
    theme.fontNormal,
    theme.marginTop3x,
  ];

  return (
    <SafeAreaView style={[theme.flexContainer, theme.backgroundPrimary]}>
      <ScrollView
        style={[
          theme.flexContainer,
          theme.backgroundPrimary,
          theme.marginTop11x,
        ]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={navToChannel}>
            <Image source={avatar} style={styles.wrappedAvatar} />
          </TouchableOpacity>
          <Text
            style={[theme.titleText, theme.colorPrimaryText, theme.marginTop]}
            onPress={navToChannel}>
            {channel.name}
          </Text>
          <Text
            onPress={navToChannel}
            style={[
              theme.subTitleText,
              theme.colorSecondaryText,
              theme.fontNormal,
            ]}>
            @{channel.username}
          </Text>
          <Text style={subscribersStyle}>
            <Text onPress={navToSubscribers} style={subscribersStyle}>
              <Text style={theme.colorPrimaryText}>
                {abbrev(channel.subscribers_count, 0)}
              </Text>{' '}
              {i18n.t('subscribers')}
            </Text>
            {'   ·   '}
            <Text onPress={navToSubscriptions} style={subscribersStyle}>
              <Text style={theme.colorPrimaryText}>
                {abbrev(channel.subscriptions_count, 0)}
              </Text>{' '}
              {i18n.t('subscriptions')}
            </Text>
          </Text>
        </View>
        <View style={styles.body}>
          {getOptionsList(props.navigation).map((l, i) =>
            !l ? null : (
              <ListItem
                Component={TouchableOpacity}
                key={i}
                title={l.name}
                titleStyle={[styles.menuText, theme.colorPrimaryText]}
                containerStyle={styles.listItem}
                pad={5}
                leftIcon={l.icon}
                onPress={l.onPress}
                {...testID(l.name)}
              />
            ),
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
    paddingTop: 23,
    paddingLeft: 40,
    paddingBottom: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCC',
  },
  icon: {
    width: 30,
  },
  menuText: {
    fontSize: Platform.select({ ios: 24, android: 22 }),
    fontWeight: '700',
    paddingLeft: 10,
  },
  wrappedAvatar: {
    height: 55,
    width: 55,
    borderRadius: 55,
  },
  body: {
    paddingLeft: 24,
    paddingTop: 40,
  },
  container: {
    borderTopWidth: 0,
    borderBottomWidth: 0,
    paddingLeft: 30,
  },
  listItem: {
    borderBottomWidth: 0,
    backgroundColor: 'transparent',
    paddingTop: 0,
    paddingBottom: Platform.select({ ios: 37, android: 32 }),
    //height:20
  },
});
