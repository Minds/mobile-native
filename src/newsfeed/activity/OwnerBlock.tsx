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
import { Icon } from 'react-native-elements';
import IconMa from 'react-native-vector-icons/MaterialIcons';
import { SearchResultStoreType } from '../../topbar/searchbar/createSearchResultStore';
import { withSearchResultStore } from '../../common/hooks/withStores';
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
  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.storeUserTap) {
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
    if (!this.props.entity.containerObj) {
      return null;
    }

    return (
      <DebouncedTouchableOpacity
        onPress={this._navToGroup}
        style={styles.groupContainer}>
        <Text
          style={[styles.groupName, ThemedStyles.style.colorSecondaryText]}
          lineBreakMode="tail"
          numberOfLines={1}>
          {this.props.entity.containerObj.name}
        </Text>
      </DebouncedTouchableOpacity>
    );
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const channel = this.props.entity.ownerObj;
    const rightToolbar = this.props.rightToolbar || null;

    const avatarSrc = channel.getAvatarSource();

    // Remind header
    const remind = this.props.entity.remind_users ? (
      <View
        style={[
          theme.paddingVertical2x,
          theme.paddingHorizontal4x,
          theme.borderBottomHair,
          theme.borderPrimary,
          theme.rowJustifyStart,
        ]}>
        <IconMa
          name="repeat"
          size={15}
          style={[theme.colorIconActive, styles.remindIcon]}
        />
        <Text>
          <Text style={theme.colorSecondaryText}>
            {i18nService.t('remindedBy')}{' '}
          </Text>
          {this.props.entity.remind_users.map((u) => (
            <Text
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

    return (
      <View style={this.props.containerStyle}>
        {remind}
        <View style={[styles.container, theme.borderPrimary]}>
          {this.props.leftToolbar}
          <DebouncedTouchableOpacity onPress={this._navToChannel}>
            <FastImage source={avatarSrc} style={styles.avatar} />
          </DebouncedTouchableOpacity>
          <View style={styles.body}>
            <View style={styles.nameContainer}>
              <DebouncedTouchableOpacity
                onPress={this._navToChannel}
                style={[theme.rowJustifyStart, theme.alignCenter]}>
                <Text
                  numberOfLines={1}
                  style={[styles.username, theme.colorPrimaryText]}>
                  {channel.name || channel.username}
                  {channel.name && (
                    <Text style={[theme.colorSecondaryText, theme.fontLight]}>
                      {' '}
                      @{channel.username}
                    </Text>
                  )}
                </Text>
              </DebouncedTouchableOpacity>
              {this.group}
            </View>
            {this.props.children}
          </View>
          {this.props.entity.boosted ? (
            <View style={[theme.rowJustifyStart, theme.centered]}>
              <Icon
                type="ionicon"
                name="md-trending-up"
                size={18}
                style={theme.marginRight}
                color={ThemedStyles.getColor('tertiary_text')}
              />

              <Text
                style={[
                  theme.marginRight2x,
                  theme.colorTertiaryText,
                  theme.fontS,
                ]}>
                {i18nService.t('boosted').toUpperCase()}
              </Text>
            </View>
          ) : undefined}
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
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 37,
    width: 37,
    borderRadius: 18.5,
  },
  body: {
    marginLeft: 10,
    paddingRight: 36,
    flexWrap: 'wrap',
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#444',
    fontSize: 17,
  },
  groupContainer: {
    alignContent: 'center',
    paddingTop: 3,
    flex: 1,
  },
  groupName: {
    fontFamily: 'Roboto',
    fontSize: 15,
  },
});
