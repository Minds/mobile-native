import React, { PureComponent } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import ThemedStyles from '../../styles/ThemedStyles';
import type ActivityModel from '../ActivityModel';
import i18nService from '../../common/services/i18n.service';
import { SearchResultStoreType } from '../../topbar/searchbar/createSearchResultStore';
import { withSearchResultStore } from '../../common/hooks/withStores';
import ChannelBadges from '../../channel/badges/ChannelBadges';
import { NavigationProp } from '@react-navigation/native';
import UserModel from '../../channel/UserModel';
import { NavigationRouteV5 } from '@sentry/react-native/dist/js/tracing/reactnavigationv5';
import { ChannelContext } from '../../channel/v2/ChannelContext';
import MText from '../../common/components/MText';
import { B1, B2, B3, Row, HairlineRow, IconNext } from '~ui';

const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  rightToolbar?: React.ReactNode;
  leftToolbar?: React.ReactNode;
  containerStyle?: ViewStyle | Array<ViewStyle>;
  navigation: any;
  route?: any;
  children?: React.ReactNode;
  storeUserTap?: boolean;
  searchResultStore: SearchResultStoreType;
};

const getLastRoute = (
  navigation: NavigationProp<any>,
): NavigationRouteV5 | null => {
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
      let groupGuid;
      try {
        groupGuid = this.props.route.params.group
          ? this.props.route.params.group.guid
          : this.props.route.params.guid;
      } catch {}
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
      <DebouncedTouchableOpacity
        onPress={this._navToGroup}
        style={styles.groupContainer}>
        <MText style={groupNameStyle} lineBreakMode="tail" numberOfLines={1}>
          {this.props.entity.containerObj.name}
        </MText>
      </DebouncedTouchableOpacity>
    );
  }

  constructor(props) {
    super(props);
    this.avatarSrc = this.props.entity.ownerObj.getAvatarSource();

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

    const name =
      channel.name && channel.name !== channel.username ? channel.name : '';

    return (
      <View style={this.containerStyle}>
        {remind}
        <View style={styles.container}>
          {this.props.leftToolbar}
          <DebouncedTouchableOpacity onPress={this._onNavToChannelPress}>
            <FastImage source={this.avatarSrc} style={styles.avatar} />
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
  groupContainer: {
    paddingTop: 3,
  },
});

const groupNameStyle = ThemedStyles.combine('fontM', 'colorSecondaryText');

const nameTouchableStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'alignCenter',
);
