import { observer } from 'mobx-react';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import TurboImage from 'react-native-turbo-image';

import MText from '../../common/components/MText';
import SmartImage from '../../common/components/SmartImage';
import type UserModel from '../UserModel';

type PropsType = {
  entity: UserModel;
};

/**
 * Channel Card
 */
@observer
export default class ChannelCard extends Component<PropsType> {
  subscribe() {
    this.props.entity.toggleSubscription();
  }

  /**
   * Render Header
   */
  render() {
    const channel = this.props.entity;
    const avatar = channel.getAvatarSource();
    const iurl = channel.getBannerSource();

    return (
      <View>
        <SmartImage source={iurl} style={styles.banner} resizeMode="cover" />
        <View style={styles.headertextcontainer}>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              <MText style={styles.name}>{channel.name.toUpperCase()}</MText>
              <MText style={styles.username}>@{channel.username}</MText>
            </View>
          </View>
        </View>
        <TurboImage source={avatar} style={styles.avatar} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headertextcontainer: {
    padding: 8,
    paddingLeft: 15,
    paddingRight: 15,
    alignItems: 'stretch',
    flexDirection: 'column',
    width: '100%',
  },
  namecol: {
    flex: 1,
  },
  namecontainer: {
    flexDirection: 'row',
    flex: 1,
    paddingLeft: 120,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 100,
  },
  headercontainer: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
  },
  username: {
    fontSize: 10,
    color: '#999',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row',
  },
  avatar: {
    position: 'absolute',
    left: 20,
    top: 50,
    height: 100,
    width: 100,
    borderRadius: 55,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
});
