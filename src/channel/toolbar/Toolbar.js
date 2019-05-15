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

import i18n from '../../common/services/i18n.service';
import colors from '../../styles/Colors';

const ICON_SIZE = 22;

@observer
export default class Toolbar extends Component {

  filterRewards = () => {
    this.props.feed.setFilter('rewards');
  }

  filterFeed = () => {
    this.props.feed.setFilter('feed');
  }

  filterImages = () => {
    this.props.feed.setFilter('images');
  }

  filterVideos = () => {
    this.props.feed.setFilter('videos');
  }

  filterBlogs = () => {
    this.props.feed.setFilter('blogs');
  }

  render() {
    const filter = this.props.feed.filter;

    const pstyles = this.props.styles;

    let rewards = null;

    if (this.props.hasRewards) {
      rewards = (
        <TouchableOpacity style={styles.button} onPress={this.filterRewards}>
          <IonIcon name="ios-flash" size={ICON_SIZE} color={filter == 'rewards' ? colors.primary : color} />
          <Text style={styles.buttontext}>{i18n.t('rewards').toUpperCase()}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.button} onPress={this.filterFeed}>
            <Icon name="list" size={ICON_SIZE} color={filter == 'feed' ? colors.primary : color} />
            <Text style={styles.buttontext}>{i18n.t('feed').toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.filterImages} >
            <IonIcon name="md-image" size={ICON_SIZE} color={filter == 'images' ? colors.primary : color} />
            <Text style={styles.buttontext}>{i18n.t('images').toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.filterVideos} >
            <IonIcon name="md-videocam" size={ICON_SIZE} color={filter == 'videos' ? colors.primary : color} />
            <Text style={styles.buttontext}>{i18n.t('videos').toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.filterBlogs}>
              <Icon name="subject" size={ICON_SIZE} color={filter == 'blogs' ? colors.primary : color} />
              <Text style={styles.buttontext}>{i18n.t('blogs.blogs').toUpperCase()}</Text>
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