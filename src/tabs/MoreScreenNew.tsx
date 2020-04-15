//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IconFa from 'react-native-vector-icons/FontAwesome5';
import { ListItem } from 'react-native-elements';

import testID from '../common/helpers/testID';
import i18n from '../common/services/i18n.service';

import abbrev from '../common/helpers/abbrev';

import featuresService from '../common/services/features.service';
import ThemedStyles from '../styles/ThemedStyles';

const ICON_SIZE = 23;

/**
 * More screen, new design (menu)
 */
@inject('user')
@observer
class MoreScreenNew extends Component {
  navToChannel = () =>
    this.props.navigation.push('Channel', { guid: this.props.user.me.guid });

  /**
   * Get Channel Avatar
   */
  getAvatar() {
    return this.props.user.me && this.props.user.me.getAvatarSource
      ? this.props.user.me.getAvatarSource('medium')
      : {};
  }

  navToSubscribers = () =>
    this.props.navigation.push('Subscribers', {
      guid: this.props.user.me.guid,
    });

  navToSubscriptions = () =>
    this.props.navigation.push('Subscribers', {
      guid: this.props.user.me.guid,
      filter: 'subscriptions',
    });

  setDarkMode = () => {
    if (ThemedStyles.theme) {
      ThemedStyles.setLight();
    } else {
      ThemedStyles.setDark();
    }
  };

  /**
   * Return Options List ready to be rendered
   */
  getOptionsList = () => {
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
        name: i18n.t('discovery.groups'),
        icon: (
          <IconFa
            name="users"
            size={ICON_SIZE - 4}
            style={[theme.colorIcon, styles.icon]}
          />
        ),
        onPress: () => {
          this.props.navigation.navigate('GroupsList');
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
            this.props.navigation.navigate('Wallet', {});
          },
        },
        {
          name: i18n.t('boost'),
          icon: (
            <Icon
              name="trending-up"
              size={ICON_SIZE}
              style={[theme.colorIcon, styles.icon]}
            />
          ),
          onPress: () => {
            this.props.navigation.navigate('BoostConsole', {
              navigation: this.props.navigation,
            });
          },
        },
      ];
    }

    list = [
      ...list,
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
          this.props.navigation.navigate('Settings');
        },
      },
    ];

    if (featuresService.has('dark-mode')) {
      const name = ThemedStyles.theme
        ? i18n.t('settings.lightMode')
        : i18n.t('settings.darkMode');

      const icon = ThemedStyles.theme ? 'wb-sunny' : 'moon';

      const IconCmp = ThemedStyles.theme ? Icon : IconFa;

      list.push({
        name,
        icon: (
          <IconCmp
            name={icon}
            size={ICON_SIZE}
            style={[theme.colorIcon, styles.icon]}
          />
        ),
        onPress: this.setDarkMode,
      });
    }

    return list;
  };

  render() {
    const avatar = this.getAvatar(),
      channel = this.props.user.me;

    const theme = ThemedStyles.style;

    const subscribersStyle = [
      theme.subTitleText,
      theme.colorTertiaryText,
      theme.fontNormal,
      theme.marginTop3x,
    ]

    return (
      <SafeAreaView style={[theme.flexContainer, theme.backgroundPrimary]}>
        <ScrollView
          style={[
            theme.flexContainer,
            theme.backgroundPrimary,
            theme.marginTop11x,
          ]}>
          <View style={styles.headerContainer}>
            <TouchableOpacity onPress={this.navToChannel}>
              <Image source={avatar} style={styles.wrappedAvatar} />
            </TouchableOpacity>
            <Text
              style={[theme.titleText, theme.colorPrimaryText, theme.marginTop]}
              onPress={this.navToChannel}>
              {channel.name}
            </Text>
            <Text
              onPress={this.navToChannel}
              style={[
                theme.subTitleText,
                theme.colorSecondaryText,
                theme.fontNormal,
              ]}>
              @{channel.username}
            </Text>
            <Text style={subscribersStyle}>
              <Text onPress={this.navToSubscribers} style={subscribersStyle}>
                {`${abbrev(channel.subscribers_count, 0)} ${i18n.t(
                  'subscribers',
                )}`}
              </Text>
              {'   ·   '}
              <Text onPress={this.navToSubscriptions} style={subscribersStyle}>
                {`${abbrev(channel.subscriptions_count, 0)} ${i18n.t(
                  'subscriptions',
                )}`}
              </Text>
            </Text>
          </View>
          <View style={styles.body}>
            {this.getOptionsList().map((l, i) => (
              <ListItem
                Component={TouchableOpacity}
                key={i}
                title={l.name}
                titleStyle={[
                  styles.menuText,
                  l.textColor || theme.colorSecondaryText,
                ]}
                containerStyle={styles.listItem}
                switchButton={l.switchButton}
                pad={5}
                hideChevron={l.hideChevron}
                leftIcon={l.icon}
                onPress={l.onPress}
                noBorder
                {...testID(l.name)}
              />
            ))}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

export default MoreScreenNew;

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
    fontSize: 24,
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
    paddingBottom: 37,
    //height:20
  },
});
