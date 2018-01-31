import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

import colors from '../../styles/Colors';

@observer
export default class Toolbar extends Component {

  render() {
    const filter = this.props.feed.filter;

    const pstyles = this.props.styles;

    let rewards = null;

    if (this.props.hasRewards) {
      rewards = (
        <TouchableOpacity style={styles.button} onPress={() => this.props.feed.setFilter('rewards')}>
          <IonIcon name="ios-flash" size={18} color={filter == 'rewards' ? colors.primary : color} />
          <Text style={styles.buttontext}>REWARDS</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.feed.setFilter('feed')}>
            <Icon name="list" size={18} color={filter == 'feed' ? colors.primary : color} />
            <Text style={styles.buttontext}>FEED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.feed.setFilter('images')} >
            <IonIcon name="md-image" size={18} color={filter == 'images' ? colors.primary : color} />
            <Text style={styles.buttontext}>IMAGES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.feed.setFilter('videos')} >
            <IonIcon name="md-videocam" size={18} color={filter == 'videos' ? colors.primary : color} />
            <Text style={styles.buttontext}>VIDEOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.feed.setFilter('blogs')}>
              <Icon name="subject" size={18} color={filter == 'blogs' ? colors.primary : color} />
              <Text style={styles.buttontext}>BLOGS</Text>
          </TouchableOpacity>
          {rewards}
        </View>
      </View>
    );
  }
}

const color = '#444'

const styles = StyleSheet.create({
  container: {
    height: 65,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 0,
    paddingRight: 0,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  buttontext: {
    paddingTop:5,
    fontSize: 10,
    color: '#444',
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
  },
});