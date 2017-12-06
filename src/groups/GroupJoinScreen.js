import React, {
  Component
} from 'react';

import {
  Image,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';

import { MINDS_URI } from '../config/Config';

/**
 * Groups join screen
 */
export default class GroupJoinScreen extends Component {

  render() {
    const group = this.props.navigation.state.params.group;
    const avatar = { uri: MINDS_URI + 'fs/v1/avatars/' + group.guid + '/large' };
    const iurl = { uri: MINDS_URI + 'fs/v1/banners/' + group.guid + '/fat/' + group.icontime };

    return (
      <ScrollView contentContainerStyle={styles.screen}>
          <Image source={iurl} style={styles.banner} resizeMode="cover" />
          <Image source={avatar} style={styles.avatar} />
          <Text style={styles.title}>{group.name}</Text>
          <Text style={styles.join}>JOIN</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
    borderTopWidth: 0,
    borderBottomWidth: 0,
    marginTop: 5
  },
  join: {
    top: -50,
    paddingTop: 0,
    fontSize: 15,
    color: '#bbb',
  },
  title: {
    top: -50,
    paddingTop:0,
    fontSize: 25,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'stretch',
    width: '100%',
    height: 190,
  },
  avatar: {
    top: -65,
    height: 130,
    width: 130,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
    borderRadius: 65
  },
  screen: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
  }
});