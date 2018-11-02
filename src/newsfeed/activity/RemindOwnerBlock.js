import React, {
  PureComponent
} from 'react';

import {
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  View
} from 'react-native';

import { Icon } from 'react-native-elements';

import {
  MINDS_CDN_URI
} from '../../config/Config';

import { CommonStyle } from '../../styles/Common';

export default class RemindOwnerBlock extends PureComponent {


  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if NewsfeedList receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.push('Channel', { guid:this.props.entity.ownerObj.guid, entity: this.props.entity.ownerObj });
    }
  }

  render() {
    const entity = this.props.entity.ownerObj;
    const avatarSrc = entity.getAvatarSource();
    return (
      <View style={styles.container}>
        <Icon color='rgb(70, 144, 214)' name='repeat' size={16} style={styles.icon}/>
        <TouchableOpacity onPress={this._navToChannel}>
          <Image source={avatarSrc} style={styles.avatar}/>
        </TouchableOpacity>
        <View style={styles.body}>
          <TouchableOpacity onPress={this._navToChannel} style={[CommonStyle.flexContainer, CommonStyle.columnAlignStart]}>
            <Text style={styles.username}>
              { entity.username }
            </Text>
            { this.props.entity.boosted &&
              <View style={styles.boostTagContainer}>
                <View style={styles.boostTagColumn}>
                  <Icon name="md-trending-up" type='ionicon' size={13} iconStyle={styles.boostTagIcon} />
                </View>
                <View style={styles.boostTagColumn}>
                  <Text style={styles.boostTagLabel}>BOOSTED</Text>
                </View>
              </View>
            }
          </TouchableOpacity>
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  boostTagContainer: {
    flexDirection: 'row',
    flex:1,
    paddingRight: 32
  },
  boostTagColumn: {
    flexDirection: 'column',
    justifyContent: 'center',
  },
  boostTagIcon: {
    color: '#aaa',
  },
  boostTagLabel: {
    color: '#aaa',
    fontWeight: '800',
    marginLeft: 2,
    fontSize: 10,
  },
  container: {
    display: 'flex',
    flex: 1,
    paddingLeft: 8,
    paddingTop: 8,
    alignItems: 'center',
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
    marginLeft: 8,
    flex:1
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#444',
    fontSize: 13,
  },
});
