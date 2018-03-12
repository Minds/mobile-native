import React, {
  Component
} from 'react';

import {
  NavigationActions
} from 'react-navigation';

import BoostActionBar from './BoostActionBar';
import ChannelCard from '../channel/card/ChannelCard';
import BlogCard from '../blogs/BlogCard';
import ImageCard from '../media/ImageCard';

import {
  Button,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  View
} from 'react-native';

import Activity from '../newsfeed/activity/Activity'
import FastImage from 'react-native-fast-image';
import ActivityModel from '../newsfeed/ActivityModel';
import BlogModel from '../blogs/BlogModel';
import UserModel from '../channel/UserModel';

export default class Boost extends Component {

  state = {

  };

  render() {

    return (
        <View style={styles.container}>
          { this.renderEntity() }
          { this.showBoostActionBar() }
        </View>
    );
  }

  showBoostActionBar() {
    return <BoostActionBar entity={this.props.boost} />
  }

  renderEntity() {
    if(this.props.boost.entity.type == 'activity') {
      return <Activity entity={ActivityModel.create(this.props.boost.entity)} hideTabs={true} navigation={this.props.navigation} />;
    } else if (this.props.boost.entity.type == 'user') {
      return <ChannelCard entity={UserModel.create(this.props.boost.entity)} navigation={this.props.navigation} />;
    } else if (this.props.boost.entity.type == 'object' && this.props.boost.entity.subtype == 'blog') {
      return <BlogCard entity={BlogModel.create(this.props.boost.entity)} navigation={this.props.navigation} />;
    } else if (this.props.boost.entity.type == 'object' && this.props.boost.entity.subtype == 'image') {
      return <ImageCard entity={this.props.boost.entity} navigation={this.props.navigation} />;
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
});