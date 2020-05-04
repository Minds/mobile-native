import React, { PureComponent } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';

import { CommonStyle } from '../../styles/Common';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import type ActivityModel from '../ActivityModel';

type PropsType = {
  entity: ActivityModel;
  navigation: any;
};
/**
 * Remind Owner Block
 */
export default class RemindOwnerBlock extends PureComponent<PropsType> {
  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if NewsfeedList receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', {
        guid: this.props.entity.ownerObj.guid,
        entity: this.props.entity.ownerObj,
      });
    }
  };

  render() {
    const entity = this.props.entity.ownerObj;
    const avatarSrc = entity.getAvatarSource();
    return (
      <View style={styles.container}>
        <Icon
          color="rgb(70, 144, 214)"
          name="repeat"
          size={16}
          style={styles.icon}
        />
        <TouchableOpacity onPress={this._navToChannel}>
          <FastImage source={avatarSrc} style={styles.avatar} />
        </TouchableOpacity>
        <View style={styles.body}>
          <TouchableOpacity
            onPress={this._navToChannel}
            style={[CommonStyle.flexContainer]}>
            <Text
              style={[styles.username, ThemedStyles.style.colorSecondaryText]}>
              {entity.username}
            </Text>
            {this.props.entity.boosted && (
              <View style={styles.boostTagContainer}>
                <Icon
                  name="md-trending-up"
                  type="ionicon"
                  size={13}
                  iconStyle={ThemedStyles.style.colorSecondaryText}
                />
                <Text
                  style={[
                    styles.boostTagLabel,
                    ThemedStyles.style.colorSecondaryText,
                  ]}>
                  {i18n.t('boosted').toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  boostTagContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    paddingRight: 32,
  },
  boostTagIcon: {
    color: '#777',
  },
  boostTagLabel: {
    fontWeight: '400',
    marginLeft: 2,
    fontSize: 9,
  },
  container: {
    display: 'flex',
    flex: 1,
    paddingLeft: 8,
    paddingTop: 8,
    alignItems: 'center',
    // justifyContent: 'center',
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 8,
    marginRight: 8,
  },
  avatar: {
    marginLeft: 8,
    height: 24,
    width: 24,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: '#EEE',
  },
  body: {
    justifyContent: 'center',
    marginLeft: 8,
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    fontSize: 13,
    lineHeight: 25,
  },
});
