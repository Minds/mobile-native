import React, {
  PureComponent
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import ActivityActions from './ActivityActions';

import {
  MINDS_URI
} from '../../config/Config';


export default class OwnerBlock extends PureComponent {

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
        <TouchableOpacity onPress={this._navToChannel}>
          <Image source={this.state.avatarSrc} style={styles.avatar}/>
        </TouchableOpacity>
        <View style={styles.body}>
          <TouchableOpacity onPress={this._navToChannel}>
            <Text style={styles.username}>
              { entity.username }
            </Text>
          </TouchableOpacity>
          {this.props.children}
        </View>
        <View style={styles.settings}>
          <ActivityActions newsfeed={this.props.newsfeed} entity={this.props.entity}/>
        </View>
      </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    padding: 8,
    alignItems: 'center',
    flexDirection: 'row',
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  body: {
    marginLeft: 8,
  },
  settings: {
    alignSelf: 'flex-end',
    position: 'absolute',
    right: 10,
    top: 20
  },
  username: {
    fontWeight: 'bold',
  },
});