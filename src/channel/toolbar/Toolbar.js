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

@inject('channelfeed')
@observer
export default class Toolbar extends Component {


  render() {
    const filter = this.props.channelfeed.filter;

    const pstyles = this.props.styles;

    let rewards = null;

    if (this.props.hasRewards) {
      rewards = (
        <TouchableOpacity style={styles.button} onPress={() => this.props.channelfeed.setFilter('rewards')}>
          <IonIcon name="ios-flash" size={18} color={filter == 'rewards' ? selectedcolor : color} />
          <Text style={styles.buttontext}>REWARDS</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.button} onPress={() => this.props.channelfeed.setFilter('feed')}>
            <Icon name="list" size={18} color={filter == 'feed' ? selectedcolor : color} />
            <Text style={styles.buttontext}>FEED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.channelfeed.setFilter('images')} >
            <IonIcon name="md-image" size={18} color={filter == 'images' ? selectedcolor : color} />
            <Text style={styles.buttontext}>IMAGES</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.channelfeed.setFilter('videos')} >
            <IonIcon name="md-videocam" size={18} color={filter == 'videos' ? selectedcolor : color} />
            <Text style={styles.buttontext}>VIDEOS</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => this.props.channelfeed.setFilter('blogs')}>
              <Icon name="subject" size={18} color={filter == 'blogs' ? selectedcolor : color} />
              <Text style={styles.buttontext}>BLOGS</Text>
          </TouchableOpacity>
          {rewards}
        </View>
      </View>
    );
  }
}

const selectedcolor = '#0071ff';
const color = '#444'

const styles = StyleSheet.create({
  container: {
    height: 65,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
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
    fontSize: 10
  },
  button: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
  },
});