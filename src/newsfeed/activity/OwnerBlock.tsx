import React, { PureComponent } from 'react';
import { Text, StyleSheet, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import withPreventDoubleTap from '../../common/components/PreventDoubleTap';
import ThemedStyles from '../../styles/ThemedStyles';
import type ActivityModel from '../ActivityModel';
const DebouncedTouchableOpacity = withPreventDoubleTap(TouchableOpacity);

type PropsType = {
  entity: ActivityModel;
  rightToolbar?: React.ReactNode;
  navigation: any;
  route?: any;
  children?: React.ReactNode;
};

/**
 * Owner Block Component
 */
export default class OwnerBlock extends PureComponent<PropsType> {
  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
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
          > {this.props.entity.containerObj.name}
        </Text>
      </DebouncedTouchableOpacity>
    );
  }

  /**
   * Render
   */
  render() {
    const channel = this.props.entity.ownerObj;
    const rightToolbar = this.props.rightToolbar || null;

    const avatarSrc = channel.getAvatarSource();

    return (
      <View style={styles.container}>
        <DebouncedTouchableOpacity onPress={this._navToChannel}>
          <FastImage source={avatarSrc} style={styles.avatar} />
        </DebouncedTouchableOpacity>
        <View style={styles.body}>
          <View style={styles.nameContainer}>
            <DebouncedTouchableOpacity onPress={this._navToChannel}>
              <Text
                style={[styles.username, ThemedStyles.style.colorPrimaryText]}>
                {channel.username}
              </Text>
            </DebouncedTouchableOpacity>
            {this.group}
          </View>
          {this.props.children}
        </View>
        {rightToolbar}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: 0.5,
    borderColor: '#EEE',
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
