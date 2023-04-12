import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import { Icon } from 'react-native-elements';
import { Image } from 'expo-image';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import ThemedStyles from '../../styles/ThemedStyles';
import type ActivityModel from '../ActivityModel';
import i18nService from '../../common/services/i18n.service';
import { SearchResultStoreType } from '../../topbar/searchbar/createSearchResultStore';
import { withSearchResultStore } from '../../common/hooks/withStores';
import ChannelBadges from '../../channel/badges/ChannelBadges';
import { NavigationProp } from '@react-navigation/native';
import UserModel from '../../channel/UserModel';
import { ChannelContext } from '../../channel/v2/ChannelContext';
import MText from '../../common/components/MText';
import { B1, B2, B3, Row, HairlineRow, IconNext, HairlineColumn } from '~ui';
import { IS_IOS } from '~/config/Config';
import NewsfeedHeader from '../NewsfeedHeader';

const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  rightToolbar?: React.ReactNode;
  leftToolbar?: React.ReactNode;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  navigation: any;
  children?: React.ReactNode;
  storeUserTap?: boolean;
  searchResultStore: SearchResultStoreType;
  distinctBoosts?: boolean;
};

const getLastRoute = (navigation: NavigationProp<any>) => {
  const routes = navigation.getState?.().routes;

  if (!routes) {
    return null;
  }

  return routes[routes.length - 1];
};

/**
 * Owner Block Component
 */
class OwnerBlock extends PureComponent<PropsType> {
  avatarSrc: any;
  containerStyle: any;

  static contextType = ChannelContext;

  /**
   * Navigate To channel
   */
  _navToChannel = (channel: UserModel) => {
    // only active if receive the navigation property
    if (this.props.storeUserTap && this.props.searchResultStore.user) {
      this.props.searchResultStore.user.searchBarItemTap(channel);
    }

    if (!this.props.navigation) {
      return null;
    }

    const lastRoute = getLastRoute(this.props.navigation);
    /**
     * do not navigate to channel if we were already in its page
     **/
    if (lastRoute && lastRoute.name === 'Channel') {
      const currentScreenChannelGuid =
        lastRoute.params?.guid || lastRoute.params?.entity?.guid;
      if (currentScreenChannelGuid === channel.guid) {
        this.context?.onSelfNavigation?.();
        return;
      }
    }

    this.props.navigation.push('Channel', {
      guid: channel.guid,
      entity: channel.ownerObj,
    });
  };

  _onNavToChannelPress = () => {
    this._navToChannel(this.props.entity.ownerObj);
  };

  /**
   * Navigate To group
   */
  _navToGroup = () => {
    if (this.props.navigation) {
      const route = getLastRoute(this.props.navigation);
      const { group, guid } = route?.params ?? {};
      const groupGuid = group?.guid ?? guid;
      if (
        this.props.entity.containerObj &&
        groupGuid === this.props.entity.containerObj.guid
      ) {
        return;
      }

      this.props.navigation.push('GroupView', {
        group: this.props.entity.containerObj,
      });
    }
  };

  get group() {
    if (!this.props.entity.containerObj || this.props.children) {
      return null;
    }

    return (
      <DebouncedTouchableOpacity onPress={this._navToGroup}>
        <MText style={groupNameStyle} lineBreakMode="tail" numberOfLines={1}>
          {this.props.entity.containerObj.name}
        </MText>
      </DebouncedTouchableOpacity>
    );
  }

  constructor(props) {
    super(props);

    this.containerStyle = ThemedStyles.combine(
      'borderBottomHair',
      'bcolorPrimaryBorder',
      props.containerStyle,
    );
  }

  /**
   * Render
   */
  render() {
    const channel = this.props.entity.ownerObj;
    const rightToolbar = this.props.rightToolbar || null;
    this.avatarSrc = this.props.entity.ownerObj.getAvatarSource();

    // Remind header
    const remind = this.props.entity.remind_users ? (
      <HairlineRow>
        <Row align="centerBoth" horizontal="XL" vertical="S">
          <IconNext name="remind" size="tiny" active right="XS" />
          <B3>{i18nService.t('remindedBy')} </B3>
          {this.props.entity.remind_users.map(u => (
            <B3
              font="medium"
              key={u.guid}
              onPress={() => this._navToChannel(u)}>
              {u.username}
            </B3>
          ))}
        </Row>
      </HairlineRow>
    ) : null;

    const boosted = this.props.entity.boosted ? (
      <HairlineColumn>
        {this.props.distinctBoosts && (
          <NewsfeedHeader title="Boosted Content" borderless />
        )}
        <Row horizontal="XL" vertical="S">
          <Icon
            type="ionicon"
            name="md-trending-up"
            size={18}
            style={ThemedStyles.style.marginRight}
            color={ThemedStyles.getColor('Link')}
          />
          <B2 font="medium" color="link">
            {i18nService.t('boosted')}
          </B2>
        </Row>
      </HairlineColumn>
    ) : undefined;

    const name =
      channel.name && channel.name !== channel.username ? channel.name : '';

    /**
     * if defined we use the channel context to get NSFW status
     * (If a user accepts to see the channel, all the avatars will be unmasked)
     */
    const isChannelNSFW = this.context?.channel
      ? channel.isNSFW() &&
        !channel.isOwner() &&
        !this.context.channel.mature_visibility
      : channel.shouldShowMaskNSFW();

    const blurAvatar =
      isChannelNSFW &&
      (this.props.entity.shouldBeBlured()
        ? this.props.entity.mature_visibility
        : true);

    return (
      <View style={this.containerStyle}>
        {boosted}
        {remind}
        <View style={styles.container}>
          {this.props.leftToolbar}
          <DebouncedTouchableOpacity onPress={this._onNavToChannelPress}>
            {blurAvatar ? (
              <Image
                source={this.avatarSrc}
                style={styles.avatar}
                blurRadius={IS_IOS ? 12 : 7}
              />
            ) : (
              <Image source={this.avatarSrc} style={styles.avatar} />
            )}
          </DebouncedTouchableOpacity>
          <View style={styles.body}>
            <View style={styles.nameContainer}>
              <View pointerEvents="box-none" style={nameTouchableStyle}>
                <B1
                  numberOfLines={1}
                  font="bold"
                  onPress={this._onNavToChannelPress}>
                  {name || channel.username}
                  {Boolean(name) && (
                    <B2 font="bold" color="secondary" numberOfLines={1}>
                      {' '}
                      @{channel.username}
                    </B2>
                  )}
                </B1>
              </View>
              {this.group}
              {this.props.children}
            </View>
          </View>
          <ChannelBadges channel={this.props.entity.ownerObj} />
          {rightToolbar}
        </View>
      </View>
    );
  }
}

export default withSearchResultStore(OwnerBlock);

const styles = StyleSheet.create({
  remindIcon: {
    paddingTop: Platform.select({ android: 3, ios: 1 }),
    paddingRight: 5,
  },
  container: {
    display: 'flex',
    paddingHorizontal: 16,
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 37,
    width: 37,
    borderRadius: 18.5,
  },
  body: {
    marginLeft: 10,
    paddingRight: 5,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'column',
  },
});

const groupNameStyle = ThemedStyles.combine('fontM', 'colorSecondaryText');

const nameTouchableStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'alignCenter',
);
