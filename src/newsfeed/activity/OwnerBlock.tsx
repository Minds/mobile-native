import React, { PureComponent } from 'react';
import {
  Text,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import ThemedStyles from '../../styles/ThemedStyles';
import type ActivityModel from '../ActivityModel';
import number from '../../common/helpers/number';
import i18nService from '../../common/services/i18n.service';
import { Icon } from 'react-native-elements';
import IconMa from 'react-native-vector-icons/MaterialIcons';
import { SearchResultStoreType } from '../../topbar/searchbar/createSearchResultStore';
import { withSearchResultStore } from '../../common/hooks/withStores';
import ChannelBadge from '../../common/components/ChannelBadge';
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
          style={[styles.groupName, ThemedStyles.style.colorPrimaryText]}
          lineBreakMode="tail"
          numberOfLines={1}>
          {'>'} {this.props.entity.containerObj.name}
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

    const showMetrics =
      !this.props.entity.boosted && this.props.entity.impressions > 0;

    return (
      <View
        style={[
          styles.container,
          theme.borderPrimary,
          this.props.containerStyle,
        ]}>
        {this.props.leftToolbar}
        <DebouncedTouchableOpacity onPress={this._navToChannel}>
          <FastImage source={avatarSrc} style={styles.avatar} />
        </DebouncedTouchableOpacity>
        <View style={styles.body}>
          <View style={styles.nameContainer}>
            <DebouncedTouchableOpacity
              onPress={this._navToChannel}
              style={[theme.rowJustifyStart, theme.alignCenter]}>
              {!!this.props.entity.remind_object && (
                <IconMa
                  name="repeat"
                  size={16}
                  style={[theme.colorIconActive, theme.marginRight]}
                />
              )}
              <Text
                numberOfLines={1}
                style={[styles.username, ThemedStyles.style.colorPrimaryText]}>
                {channel.username}
              </Text>
              {
                //@ts-ignore
                <ChannelBadge channel={channel} />
              }
            </DebouncedTouchableOpacity>
            {this.group}
          </View>
          {this.props.children}
        </View>
        {showMetrics ? (
          <Text
            numberOfLines={1}
            style={[
              theme.marginRight2x,
              theme.colorSecondaryText,
              theme.fontM,
            ]}>
            {number(this.props.entity.impressions, 0)}{' '}
            {i18nService.t('views').toLowerCase()}
          </Text>
        ) : undefined}
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
    );
  }
}

export default withSearchResultStore(OwnerBlock);

const styles = StyleSheet.create({
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
    marginLeft: 8,
    paddingRight: 36,
    flexWrap: 'wrap',
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#444',
    fontSize: 16,
  },
  groupContainer: {
    marginLeft: 4,
    flex: 1,
  },
  groupName: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
  },
});
