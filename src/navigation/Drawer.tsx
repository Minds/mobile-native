import React from 'react';
import { View, Text, Image, StyleSheet, Platform } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFo from 'react-native-vector-icons/Feather';
import IconFa from 'react-native-vector-icons/FontAwesome5';
import IconMC from 'react-native-vector-icons/MaterialCommunityIcons';
import { ListItem } from 'react-native-elements';

import testID from '../common/helpers/testID';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import featuresService from '../common/services/features.service';
import sessionService from '../common/services/session.service';
import { GOOGLE_PLAY_STORE } from '../config/Config';

const ICON_SIZE = 25;

const getOptionsList = (navigation) => {
  const theme = ThemedStyles.style;

  const hasRewards = sessionService.getUser().rewards;

  let list = [
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
    !GOOGLE_PLAY_STORE
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
    featuresService.has('plus-2020') && !GOOGLE_PLAY_STORE
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
    featuresService.has('crypto')
      ? {
          name: i18n.t('moreScreen.wallet'),
          icon: (
            <IconMC
              name="bank"
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
        }
      : null,
    {
      name: i18n.t('earnScreen.title'),
      icon: (
        <Icon
          name="attach-money"
          size={ICON_SIZE}
          style={[theme.colorIcon, styles.icon]}
        />
      ),
      onPress: () => {
        navigation.navigate('EarnModal');
      },
    },
    {
      name: 'Buy Tokens',
      icon: (
        <IconFa
          name="coins"
          size={ICON_SIZE}
          style={[theme.colorIcon, styles.icon]}
        />
      ),
      onPress: () => {
        const navToBuyTokens = () => {
          navigation.navigate('Tabs', {
            screen: 'CaptureTab',
            params: { screen: 'BuyTokens' },
          });
        };
        if (!hasRewards) {
          navigation.navigate('PhoneValidation', {
            onComplete: navToBuyTokens,
          });
        } else {
          navToBuyTokens();
        }
      },
    },
  ];
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
      name: i18n.t('discovery.groups'),
      icon: (
        <IconMC
          name="account-multiple"
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

  const navToChannel = () => {
    props.navigation.closeDrawer();
    props.navigation.push('Channel', { entity: channel });
  };

  const theme = ThemedStyles.style;
  const avatar =
    channel && channel.getAvatarSource ? channel.getAvatarSource('medium') : {};

  return (
    <SafeAreaView style={[theme.flexContainer, theme.backgroundPrimary]}>
      <View style={[theme.flexContainer, theme.backgroundPrimary]}>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={navToChannel}>
            <Image source={avatar} style={styles.wrappedAvatar} />
          </TouchableOpacity>
          <View style={[theme.flexColumn, theme.marginLeft2x]}>
            <Text
              style={[styles.titleText, theme.colorPrimaryText]}
              onPress={navToChannel}>
              {channel.name || `@${channel.username}`}
            </Text>
            {channel.name && (
              <Text
                onPress={navToChannel}
                style={[styles.subTitleText, theme.colorSecondaryText]}>
                @{channel.username}
              </Text>
            )}
          </View>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleText: {
    fontFamily: 'Roboto',
    fontSize: Platform.select({ ios: 26, android: 24 }),
    fontWeight: '700',
  },
  subTitleText: {
    fontFamily: 'Roboto',
    fontSize: Platform.select({ ios: 16, android: 15 }),
    fontWeight: '400',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingTop: Platform.select({ ios: 33, android: 23 }),
    paddingLeft: 40,
    paddingBottom: 25,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#CCC',
  },
  icon: {
    width: 30,
  },
  menuText: {
    fontSize: Platform.select({ ios: 21, android: 19 }),
    fontWeight: '700',
    paddingLeft: 10,
  },
  wrappedAvatar: {
    height: 55,
    width: 55,
    borderRadius: 55,
  },
  body: {
    paddingLeft: Platform.select({ ios: 35, android: 25 }),
    paddingTop: Platform.select({ ios: 50, android: 30 }),
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
    paddingBottom: Platform.select({ ios: 30, android: 25 }),
  },
});
