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
  MINDS_URI
} from '../../config/Config';

export default class RemindOwnerBlock extends PureComponent {

  state = {
    avatarSrc: { uri: MINDS_URI + 'icon/' + this.props.entity.ownerObj.guid + '/medium' }
  };

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if NewsfeedList receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid:this.props.entity.ownerObj.guid});
    }
  }

  render() {
    const entity = this.props.entity.ownerObj;
    return (
      <View style={styles.container}>
        <Icon color='rgb(70, 144, 214)' name='repeat' size={20}/>
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
    padding: 4,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
    borderColor: '#EEE',
  },
  body: {
    marginLeft: 8,
  },
  username: {
    fontWeight: 'bold',
  },
});