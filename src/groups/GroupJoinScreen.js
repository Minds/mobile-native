import React, {
  Component
} from 'react';

import {
  Image,
  Text,
  ScrollView,
  StyleSheet,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { MINDS_CDN_URI } from '../config/Config';
import groupsService from './GroupsService';
import CenteredLoading from '../common/components/CenteredLoading';
/**
 * Groups join screen
 */
export default class GroupJoinScreen extends Component {

  //TODO: move state to store
  state = {
    group: null
  }

  componentWillMount() {
    if (this.props.navigation.state.params.group) {
      this.setState({
        group: this.props.navigation.state.params.group
      })
    } else {
      groupsService.loadEntity(this.props.navigation.state.params.guid)
        .then(group => {
          this.setState({group});
        });
    }
  }

  render() {
    const group = this.state.group;

    if (!group) {
      return <CenteredLoading />
    }

    const avatar = { uri: MINDS_CDN_URI + 'fs/v1/avatars/' + group.guid + '/large' };
    const iurl = { uri: MINDS_CDN_URI + 'fs/v1/banners/' + group.guid + '/fat/' + group.icontime };

    return (
      <ScrollView contentContainerStyle={styles.screen}>
        <FastImage source={iurl} style={styles.banner} resizeMode={FastImage.resizeMode.cover} />
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
