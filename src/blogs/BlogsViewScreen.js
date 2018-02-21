import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';


import { inject } from 'mobx-react/native';

import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements'
import AutoHeightWebView from '../common/components/AutoHeightWebView';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';

import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import RemindAction from '../newsfeed/activity/actions/RemindAction';
import CommentsAction from '../newsfeed/activity/actions/CommentsAction';
import shareService from '../share/ShareService';

/**
 * Blog View Screen
 */
@inject('user')
export default class BlogsViewScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  share = () => {
    const blog = this.props.navigation.state.params.blog;
    shareService.share(blog.title, blog.perma_url);
  }

  /**
   * Render
   */
  render() {
    const blog = this.props.navigation.state.params.blog;
    const image = { uri: blog.thumbnail_src };

    const actions = (
      <View style={[CommonStyle.flexContainer, CommonStyle.paddingLeft2x]}>
        <View style={styles.container}>
          <RemindAction entity={blog} />
          <ThumbUpAction entity={blog} orientation='column' me={this.props.user.me} />
          <ThumbDownAction entity={blog} orientation='column' me={this.props.user.me} />
          <CommentsAction entity={blog} navigation={this.props.navigation} />
        </View>
      </View>
    )

    return (
      <ScrollView style={styles.screen}>
        <FastImage source={image} resizeMode={FastImage.resizeMode.cover} style={styles.image} />
        <Text style={styles.title}>{blog.title}</Text>
        <OwnerBlock entity={blog} navigation={this.props.navigation} rightToolbar={actions}>
          <Text style={styles.timestamp}>{formatDate(blog.time_created)}</Text>
        </OwnerBlock>
        <View style={[CommonStyle.rowJustifyEnd, CommonStyle.alignCenter, CommonStyle.paddingRight2x]}>
          <Icon color={colors.medium} size={18} name='public' onPress={() => this.props.navigation.goBack()} />
          <Text style={[CommonStyle.fontXS, CommonStyle.paddingLeft, CommonStyle.colorMedium, CommonStyle.paddingRight2x]}>{blog.license}</Text>
          <Icon color={colors.primary} size={20} name='share' onPress={this.share} />
        </View>
        <View style={styles.description}>
          <AutoHeightWebView html={blog.description}/>
        </View>
        <Icon color="white" containerStyle={styles.header} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
      </ScrollView>
    )
  }
}

/**
 * Styles
 */
const styles = {
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: 40,
    width: 40,
  },
  container: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  description: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  screen: {
    backgroundColor: '#FFF'
  },
  image: {
    height: 200
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  title: {
    paddingTop: 10,
    paddingBottom: 5,
    paddingLeft: 15,
    paddingRight: 15,
    fontSize: 22,
    color: 'black'
  },
}