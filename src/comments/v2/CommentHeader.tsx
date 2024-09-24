import React, { PureComponent } from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import TurboImage from 'react-native-turbo-image';
import { TouchableOpacity } from '@gorhom/bottom-sheet';

import withPreventDoubleTap from '~/common/components/PreventDoubleTap';

import type CommentModel from './CommentModel';
import ChannelBadges from '~/channel/badges/ChannelBadges';
import MText from '~/common/components/MText';
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);
import sp from '~/services/serviceProvider';

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
    sp.navigation.push('App', {
      screen: 'Channel',
      params: {
        guid: this.props.entity.ownerObj.guid,
        entity: this.props.entity.ownerObj,
      },
    });
  };

  /**
   * Render
   */
  render() {
    const theme = sp.styles.style;
    const channel = this.props.entity.ownerObj;
    const rightToolbar = this.props.rightToolbar || null;

    const avatarSrc = channel.getAvatarSource();

    const name =
      channel.name && channel.name !== channel.username ? channel.name : '';

    const date = sp.i18n.date(
      parseInt(this.props.entity.time_created, 10) * 1000,
      'friendly',
    );

    return (
      <View style={styles.mainContainer}>
        <View style={styles.container}>
          {this.props.leftToolbar}
          <DebouncedTouchableOpacity onPress={this._navToChannel}>
            <TurboImage source={avatarSrc} style={styles.avatar} />
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
                style={[styles.groupName, sp.styles.style.colorSecondaryText]}
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
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
  },
  groupName: {
    fontFamily: 'Roboto_400Regular',
    fontSize: 15,
    marginTop: 1,
  },
});
