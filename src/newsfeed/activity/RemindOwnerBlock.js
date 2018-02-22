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
  NavigationActions
} from 'react-navigation';

import {
  MINDS_CDN_URI
} from '../../config/Config';

export default class RemindOwnerBlock extends PureComponent {

  state = {
    avatarSrc: { uri: MINDS_CDN_URI + 'icon/' + this.props.entity.ownerObj.guid + '/medium' }
  };

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if NewsfeedList receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid:this.props.entity.ownerObj.guid, entity: this.props.entity.ownerObj });
    }
  }

  render() {
    const entity = this.props.entity.ownerObj;
    return (
      <View style={styles.container}>
        <Icon color='rgb(70, 144, 214)' name='repeat' size={16} style={styles.icon}/>
        <TouchableOpacity onPress={this._navToChannel}>
          <Image source={this.state.avatarSrc} style={styles.avatar}/>
        </TouchableOpacity>
        <View style={styles.body}>
          <TouchableOpacity onPress={this._navToChannel}>
            <Text style={styles.username}>
              { entity.username }
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
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
  },
  username: {
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    color: '#444',
    fontSize: 13,
  },
});
