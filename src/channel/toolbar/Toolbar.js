import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity
} from 'react-native';

import {
  observer,
} from 'mobx-react/native';

import Icon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome5';

import i18n from '../../common/services/i18n.service';
import colors from '../../styles/Colors';
import featuresService from '../../common/services/features.service';

const ICON_SIZE = 22;

export default
@observer
class Toolbar extends Component {

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

  filterRequests = () => {
    this.props.feed.setFilter('requests');
    this.props.subscriptionRequest.load();
  }

  render() {
    const filter = this.props.feed.filter;

    const pstyles = this.props.styles;

    let rewards = null, subscriptionRequests = null;

    if (this.props.hasRewards) {
      rewards = (
        <TouchableOpacity style={styles.button} onPress={this.filterRewards}>
          <IonIcon name="ios-flash" size={ICON_SIZE} color={filter == 'rewards' ? colors.primary : color} style={styles.icon} />
          <Text style={[styles.buttontext, filter == 'rewards' ? styles.buttontextSelected : null]}>{i18n.t('rewards').toUpperCase()}</Text>
        </TouchableOpacity>
      )
    }

    if (this.props.channel.isOwner() && featuresService.has('permissions') && !this.props.channel.isOpen()) {
      subscriptionRequests = (
        <TouchableOpacity style={styles.button} onPress={this.filterRequests}>
          <FAIcon name="user-check" size={ICON_SIZE} color={filter == 'requests' ? colors.primary : color} style={styles.icon} />
          <Text style={[styles.buttontext, filter == 'requests' ? styles.buttontextSelected : null]}>{i18n.t('requests').toUpperCase()}</Text>
        </TouchableOpacity>
      )
    }

    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={styles.button} onPress={this.filterFeed} testID="FeedButton">
            <Icon name="list" size={ICON_SIZE} color={filter == 'feed' ? colors.primary : color} style={styles.icon} />
            <Text style={[styles.buttontext, filter == 'feed' ? styles.buttontextSelected : null]}>{i18n.t('feed').toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.filterImages} testID="ImagesButton">
            <IonIcon name="md-image" size={ICON_SIZE} color={filter == 'images' ? colors.primary : color} style={styles.icon} />
            <Text style={[styles.buttontext, filter == 'images' ? styles.buttontextSelected : null]}>{i18n.t('images').toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.filterVideos} testID="VideosButton">
            <IonIcon name="md-videocam" size={ICON_SIZE} color={filter == 'videos' ? colors.primary : color} style={styles.icon} />
            <Text style={[styles.buttontext, filter == 'videos' ? styles.buttontextSelected : null]}>{i18n.t('videos').toUpperCase()}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={this.filterBlogs} testID="BlogsButton">
            <Icon name="subject" size={ICON_SIZE} color={filter == 'blogs' ? colors.primary : color} style={styles.icon} />
            <Text style={[styles.buttontext, filter == 'blogs' ? styles.buttontextSelected : null]}>{i18n.t('blogs.blogs').toUpperCase()}</Text>
          </TouchableOpacity>
          {rewards}
          {subscriptionRequests}
        </View>
      </View>
    );
  }
}

const color = '#444'

const styles = StyleSheet.create({
  container: {
    height: 55,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 5,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#EEE',
  },
  icon: {
    height: 25,
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
  buttontextSelected: {
    color: colors.primary
  },
  button: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
    alignItems: 'center',
    padding: 3,
  },
});