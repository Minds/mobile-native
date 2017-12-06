import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  View
} from 'react-native';

import {
  MINDS_URI
} from '../../config/Config';


export default class OwnerBlock extends Component {

  state = {
    avatarSrc: { uri: MINDS_URI + 'icon/' + this.props.entity.guid + '/medium' }
  };

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if NewsfeedList receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid:this.props.entity.guid});
    }
  }

  render() {
    return (
        <View style={styles.container}>
          <TouchableOpacity onPress={this._navToChannel}>
            <Image source={this.state.avatarSrc} style={styles.avatar}/>
          </TouchableOpacity>
          <View style={styles.body}>
            <Text style={styles.username}>
              { this.props.entity.username }
            </Text>
            {this.props.children}
          </View>
        </View>
    );
  }


}

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8
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
  username: {
    fontWeight: 'bold',
  },
});