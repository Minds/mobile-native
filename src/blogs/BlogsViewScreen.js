import React, {
  Component
} from 'react';

import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
} from 'react-native';


import { inject, observer } from 'mobx-react/native';

import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements'
import BlogViewHTML from './BlogViewHTML';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import { CommonStyle } from '../styles/Common';
import colors from '../styles/Colors';

import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import RemindAction from '../newsfeed/activity/actions/RemindAction';
import CommentsAction from '../newsfeed/activity/actions/CommentsAction';
import shareService from '../share/ShareService';
import CenteredLoading from '../common/components/CenteredLoading';

/**
 * Blog View Screen
 */
@inject('user', 'blogsView')
@observer
export default class BlogsViewScreen extends Component {

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null
  }

  share = () => {
    const blog = this.props.blogsView.blog;
    shareService.share(blog.title, blog.perma_url);
  }

  componentWillMount() {
    const params = this.props.navigation.state.params;

    if (params.blog) {
      this.props.blogsView.setBlog(params.blog);
    } else {
      this.props.blogsView.reset();
      this.props.blogsView.loadBlog(params.guid);
    }
  }

  /**
   * Render
   */
  render() {
    const blog = this.props.blogsView.blog;

    if (!blog) return <CenteredLoading/>

    const image = blog.getBannerSource();

    const actions = (
      <View style={[CommonStyle.flexContainer, CommonStyle.paddingLeft2x]}>
        <View style={styles.actionsContainer}>
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
        <View style={styles.ownerBlockContainer}>
          <OwnerBlock entity={blog} navigation={this.props.navigation} rightToolbar={actions}>
            <Text style={styles.timestamp}>{formatDate(blog.time_created)}</Text>
          </OwnerBlock>
        </View>
        <View style={styles.description}>
          <BlogViewHTML html={blog.description} />
        </View>
        <View style={styles.moreInformation}>
          <Icon color={colors.medium} size={18} name='public' onPress={() => this.props.navigation.goBack()} />
          <Text style={[CommonStyle.fontXS, CommonStyle.paddingLeft, CommonStyle.colorMedium, CommonStyle.paddingRight2x]}>{blog.getLicenseText()}</Text>
          <Icon color={colors.primary} size={20} name='share' onPress={this.share} />
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
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4
  },
  title: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 22,
    color: '#444',
    fontFamily: 'Roboto',
    fontWeight: '800',
  },
  ownerBlockContainer: {
    margin: 8,
  },
  description: {
    paddingLeft: 12,
    paddingRight: 12,
    paddingBottom: 12,
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
  moreInformation: {
    padding: 12,
    flexDirection: 'row',
  },
}