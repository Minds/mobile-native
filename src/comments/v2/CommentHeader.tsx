import React, { PureComponent } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import FastImage from 'react-native-fast-image';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import ThemedStyles from '../../styles/ThemedStyles';
import type CommentModel from './CommentModel';
import ChannelBadges from '../../channel/badges/ChannelBadges';
import { TouchableOpacity } from '@gorhom/bottom-sheet';
import i18n from '../../common/services/i18n.service';
import MText from '../../common/components/MText';
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: CommentModel;
  rightToolbar?: React.ReactNode;
  leftToolbar?: React.ReactNode;
  navigation: any;
  children?: React.ReactNode;
  storeUserTap?: boolean;
};

/**
 * Comment Header Component
 */
class CommentHeader extends PureComponent<PropsType> {
  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.ownerObj.guid,
        entity: this.props.entity.ownerObj,
      });
    }
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    const channel = this.props.entity.ownerObj;
    const rightToolbar = this.props.rightToolbar || null;

    const avatarSrc = channel.getAvatarSource();

    const name =
      channel.name && channel.name !== channel.username ? channel.name : '';

    const date = i18n.date(
      parseInt(this.props.entity.time_created, 10) * 1000,
      'friendly',
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          {this.props.leftToolbar}
          <DebouncedTouchableOpacity onPress={this._navToChannel}>
            <FastImage source={avatarSrc} style={styles.avatar} />
          </DebouncedTouchableOpacity>
          <View style={styles.body}>
            <View style={styles.nameContainer}>
              <DebouncedTouchableOpacity
                onPress={this._navToChannel}
                style={[theme.rowJustifyStart, theme.alignCenter]}>
                <MText
                  numberOfLines={1}
                  style={[
                    styles.username,
                    theme.colorPrimaryText,
                    theme.flexContainer,
                  ]}>
                  {name || channel.username}
                  {Boolean(name) && (
                    <MText
                      numberOfLines={1}
                      style={[
                        styles.username,
                        theme.colorSecondaryText,
                        theme.fontLight,
                      ]}>
                      {' '}
                      @{channel.username}
                    </MText>
                  )}
                </MText>
              </DebouncedTouchableOpacity>
              <MText
                style={[
                  styles.groupName,
                  ThemedStyles.style.colorSecondaryText,
                ]}
                lineBreakMode="tail"
                numberOfLines={1}>
                {date}
              </MText>
            </View>
          </View>
          <ChannelBadges channel={this.props.entity.ownerObj} />
          {rightToolbar}
        </View>
      </View>
    );
  }
}

export default CommentHeader;

const styles = StyleSheet.create({
  remindIcon: {
    paddingTop: Platform.select({ android: 3, ios: 1 }),
    paddingRight: 5,
  },
  mainContainer: {
    flex: 1,
  },
  container: {
    display: 'flex',
    paddingHorizontal: 10,
    paddingVertical: 13,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 37,
    width: 37,
    borderRadius: 18.5,
    marginRight: 5,
  },
  body: {
    marginLeft: 10,
    paddingRight: 15,
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'column',
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 15,
  },
  groupName: {
    fontFamily: 'Roboto',
    fontSize: 15,
    marginTop: 1,
  },
});
