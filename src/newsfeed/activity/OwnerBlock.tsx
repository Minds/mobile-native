import React, { PureComponent } from 'react';
import {
  Text,
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
import IconMa from 'react-native-vector-icons/MaterialIcons';
import { SearchResultStoreType } from '../../topbar/searchbar/createSearchResultStore';
import { withSearchResultStore } from '../../common/hooks/withStores';
import ChannelBadges from '../../channel/badges/ChannelBadges';
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

/**
 * Owner Block Component
 */
class OwnerBlock extends PureComponent<PropsType> {
  avatarSrc: any;
  containerStyle: any;

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.storeUserTap && this.props.searchResultStore.user) {
      this.props.searchResultStore.user.searchBarItemTap(
        this.props.entity.ownerObj,
      );
    }
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.ownerObj.guid,
        entity: this.props.entity.ownerObj,
      });
    }
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
        <Text style={groupNameStyle} lineBreakMode="tail" numberOfLines={1}>
          {this.props.entity.containerObj.name}
        </Text>
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
    const theme = ThemedStyles.style;
    const channel = this.props.entity.ownerObj;
    const rightToolbar = this.props.rightToolbar || null;

    // Remind header
    const remind = this.props.entity.remind_users ? (
      <View style={remindContainer}>
        <IconMa name="repeat" size={15} style={remindIconStyle} />
        <Text>
          <Text style={theme.colorSecondaryText}>
            {i18nService.t('remindedBy')}{' '}
          </Text>
          {this.props.entity.remind_users.map(u => (
            <Text
              key={u.guid}
              onPress={() => {
                if (!this.props.navigation) return;
                this.props.navigation.push('Channel', {
                  guid: u.guid,
                  entity: u,
                });
              }}>
              {u.username}
            </Text>
          ))}
        </Text>
      </View>
    ) : null;

    const name =
      channel.name && channel.name !== channel.username ? channel.name : '';

    return (
      <View style={this.containerStyle}>
        {remind}
        <View style={styles.container}>
          {this.props.leftToolbar}
          <DebouncedTouchableOpacity onPress={this._navToChannel}>
            <FastImage source={this.avatarSrc} style={styles.avatar} />
          </DebouncedTouchableOpacity>
          <View style={styles.body}>
            <View style={styles.nameContainer}>
              <View pointerEvents="box-none" style={nameTouchableStyle}>
                <Text
                  numberOfLines={1}
                  style={nameStyle}
                  onPress={this._navToChannel}>
                  {name || channel.username}
                  {Boolean(name) && (
                    <Text numberOfLines={1} style={usernameStyle}>
                      {' '}
                      @{channel.username}
                    </Text>
                  )}
                </Text>
              </View>
              {this.group}
              {this.props.children}
            </View>
          </View>
          <ChannelBadges
            size={20}
            channel={this.props.entity.ownerObj}
            iconStyle={theme.colorLink}
          />
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
    paddingHorizontal: 20,
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

const remindIconStyle = ThemedStyles.combine(
  'colorIconActive',
  styles.remindIcon,
);

const groupNameStyle = ThemedStyles.combine('fontM', 'colorSecondaryText');
const usernameStyle = ThemedStyles.combine(
  'colorSecondaryText',
  'fontLight',
  'bold',
  'fontLM',
);
const nameStyle = ThemedStyles.combine(
  'colorPrimaryText',
  'fontLight',
  'bold',
  'fontLM',
  'flexContainer',
);
const remindContainer = ThemedStyles.combine(
  'paddingVertical2x',
  'paddingHorizontal4x',
  'borderBottomHair',
  'bcolorPrimaryBorder',
  'rowJustifyStart',
);

const nameTouchableStyle = ThemedStyles.combine(
  'rowJustifyStart',
  'alignCenter',
);
