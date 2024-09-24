import React, { Component } from 'react';

import { View, StyleSheet } from 'react-native';
import TurboImage from 'react-native-turbo-image';

import { observer } from 'mobx-react';
import SmartImage from '../common/components/SmartImage';
import { MINDS_CDN_URI } from '../config/Config';
import MText from '../common/components/MText';
import type ActivityModel from '~/newsfeed/ActivityModel';
import sp from '~/services/serviceProvider';

type Props = {
  entity: ActivityModel;
};

/**
 * Channel Card
 */
@observer
export default class ImageCard extends Component<Props> {
  /**
   * Get Channel Avatar
   */
  getAvatar() {
    const channel = this.props.entity.ownerObj;
    return {
      uri:
        MINDS_CDN_URI + 'icon/' + channel.guid + '/small/' + channel.icontime,
    };
  }

  /**
   * Render Card
   */
  render() {
    const entity = this.props.entity;

    return (
      <View>
        {entity.thumbnail_src && (
          <SmartImage
            source={{ uri: entity.thumbnail_src }}
            style={styles.banner}
            resizeMode="cover"
          />
        )}
        <View style={styles.headertextcontainer}>
          <View style={styles.namecontainer}>
            <View style={styles.namecol}>
              <View style={styles.ownerContainer}>
                <TurboImage source={this.getAvatar()} style={styles.avatar} />
                <MText style={styles.username}>
                  {entity.ownerObj.username.toUpperCase()}
                </MText>
                <MText style={styles.createdDate}>
                  {sp.i18n.date(parseInt(entity.time_created, 10) * 1000)}
                </MText>
              </View>
            </View>
          </View>
        </View>
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
  },
  ownerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignSelf: 'flex-start',
    padding: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 150,
  },
  headercontainer: {
    flex: 1,
    height: 100,
    flexDirection: 'row',
  },
  username: {
    paddingLeft: 5,
    fontSize: 10,
    color: '#999',
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  createdDate: {
    paddingLeft: 5,
    fontSize: 8,
  },
  countercontainer: {
    paddingLeft: 130,
    height: 60,
    flexDirection: 'row',
  },
  avatar: {
    height: 20,
    width: 20,
    borderRadius: 10,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#FFF',
  },
});
