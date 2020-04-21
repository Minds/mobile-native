//@ts-nocheck
import React, { Component } from 'react';

import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  TextInput,
  Keyboard,
  TouchableOpacity,
  TouchableHighlight,
  FlatList,
  Text,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';

import ActionSheet from 'react-native-actionsheet';

import { Header } from '@react-navigation/stack';

import { inject, observer } from 'mobx-react';

import FastImage from 'react-native-fast-image';
import { Icon } from 'react-native-elements';
import IonIcon from 'react-native-vector-icons/Ionicons';

import BlogViewHTML from './BlogViewHTML';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import formatDate from '../common/helpers/date';
import { CommonStyle as CS } from '../styles/Common';
import colors from '../styles/Colors';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import RemindAction from '../newsfeed/activity/actions/RemindAction';
import CommentsAction from '../newsfeed/activity/actions/CommentsAction';
import shareService from '../share/ShareService';
import commentsStoreProvider from '../comments/CommentsStoreProvider';
import CommentList from '../comments/CommentList';
import CenteredLoading from '../common/components/CenteredLoading';
import logService from '../common/services/log.service';
import i18n from '../common/services/i18n.service';
import featuresService from '../common/services/features.service';
import { FLAG_VIEW } from '../common/Permissions';
import ThemedStyles from '../styles/ThemedStyles';

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
    header: null,
  };

  share = () => {
    const blog = this.props.blogsView.blog;
    shareService.share(blog.title, blog.perma_url);
  };

  state = {
    error: null,
  };

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    this.comments = commentsStoreProvider.get();
  }

  /**
   * Component did mount
   */
  async componentDidMount() {
    const params = this.props.route.params;
    try {
      if (params.blog) {
        if (params.blog._list && params.blog._list.metadataService) {
          params.blog._list.metadataService.pushSource('single');
        }
        this.props.blogsView.setBlog(params.blog);

        if (!params.blog.description) {
          await this.props.blogsView.loadBlog(params.blog.guid);
        }
      } else {
        this.props.blogsView.reset();
        let guid;
        if (params.slug) {
          guid = params.slug.substr(params.slug.lastIndexOf('-') + 1);
        } else {
          guid = params.guid;
        }

        await this.props.blogsView.loadBlog(guid);
      }

      // check permissions
      if (!this.props.blogsView.blog.can(FLAG_VIEW, true)) {
        this.props.navigation.goBack();
        return;
      }

      if (this.props.blogsView.blog && this.props.blogsView.blog._list) {
        this.props.blogsView.blog._list.viewed.addViewed(
          this.props.blogsView.blog,
          this.props.blogsView.blog._list.metadataService,
        );
      }
    } catch (error) {
      logService.exception(error);
      Alert.alert(
        'Error',
        error.message || i18n.t('blogs.errorLoading'),
        [{ text: i18n.t('ok'), onPress: () => this.props.navigation.goBack() }],
        { cancelable: false },
      );
    }
  }

  /**
   * On component will unmount
   */
  componentWillUnmount() {
    const blog = this.props.blogsView.blog;
    if (blog._list && blog._list.metadataService) {
      blog._list.metadataService.popSource();
    }
    this.props.blogsView.reset();
  }

  /**
   * Render blog
   */
  getHeader() {
    const blog = this.props.blogsView.blog;
    const theme = ThemedStyles.style;

    const actions = (
      <View style={[CS.rowJustifyStart]}>
        <RemindAction entity={blog} navigation={this.props.navigation} />
        <ThumbUpAction entity={blog} />
        <ThumbDownAction entity={blog} />
      </View>
    );
    const image = blog.getBannerSource();

    const actionSheet = this.getActionSheet();
    const optMenu = featuresService.has('allow-comments-toggle') ? (
      <View style={styles.rightToolbar}>
        <Icon
          name="more-vert"
          onPress={() => this.showActionSheet()}
          size={26}
          style={styles.icon}
        />
        {actionSheet}
      </View>
    ) : null;
    return (
      <View style={[styles.screen, theme.backgroundSecondary]}>
        <FastImage
          source={image}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
        <Text style={styles.title}>{blog.title}</Text>
        {optMenu}
        <View style={styles.ownerBlockContainer}>
          <OwnerBlock entity={blog} navigation={this.props.navigation}>
            <Text style={[styles.timestamp, theme.colorSecondaryText]}>
              {formatDate(blog.time_created)}
            </Text>
          </OwnerBlock>
        </View>
        {actions}
        <View style={styles.description}>
          {blog.description ? (
            <BlogViewHTML html={blog.description} />
          ) : (
            <CenteredLoading />
          )}
        </View>
        <View style={styles.moreInformation}>
          {Boolean(blog.getLicenseText()) && (
            <Icon color={colors.medium} size={18} name="public" />
          )}
          <Text
            style={[
              CS.fontXS,
              CS.paddingLeft,
              CS.colorMedium,
              CS.paddingRight2x,
            ]}>
            {blog.getLicenseText()}
          </Text>
          <Icon
            color={colors.primary}
            size={20}
            name="share"
            onPress={this.share}
          />
        </View>
        <SafeAreaView style={styles.header}>
          <Icon
            raised
            color={colors.primary}
            size={22}
            name="arrow-back"
            onPress={() => this.props.navigation.goBack()}
          />
        </SafeAreaView>
      </View>
    );
  }

  getActionSheet() {
    let options = [i18n.t('cancel')];
    options.push(
      this.props.blogsView.blog.allow_comments
        ? i18n.t('disableComments')
        : i18n.t('enableComments'),
    );
    return (
      <ActionSheet
        ref={(o) => (this.ActionSheet = o)}
        options={options}
        onPress={(i) => {
          this.handleActionSheetSelection(options[i]);
        }}
        cancelButtonIndex={0}
      />
    );
  }

  async showActionSheet() {
    this.ActionSheet.show();
  }

  async handleActionSheetSelection(option) {
    switch (option) {
      case i18n.t('disableComments'):
      case i18n.t('enableComments'):
        try {
          await this.props.blogsView.blog.toggleAllowComments();
        } catch (err) {
          console.error(err);
          this.showError();
        }
    }
  }

  /**
   * Show an error message
   */
  showError() {
    Alert.alert(
      i18n.t('sorry'),
      i18n.t('errorMessage') + '\n' + i18n.t('activity.tryAgain'),
      [{ text: i18n.t('ok'), onPress: () => {} }],
      { cancelable: false },
    );
  }

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;

    if (!this.props.blogsView.blog) {
      return <CenteredLoading />;
    } else {
      // force observe on description
      const desc = this.props.blogsView.blog.description;
    }

    // check async update of permissions
    if (!this.props.blogsView.blog.can(FLAG_VIEW, true)) {
      this.props.navigation.goBack();
      return null;
    }

    return (
      <View style={[CS.flexContainer, theme.backgroundSecondary]}>
        {!this.state.error ? (
          <CommentList
            header={this.getHeader()}
            entity={this.props.blogsView.blog}
            store={this.comments}
            navigation={this.props.navigation}
            route={this.props.route}
            keyboardVerticalOffset={Header.HEIGHT - 65}
          />
        ) : (
          <View style={CS.flexColumnCentered}>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              style={ComponentsStyle.logo}
              source={require('../assets/logos/logo.png')}
            />
            <Text style={[CS.fontL, CS.colorDanger]}>
              {i18n.t('blogs.error')}
            </Text>
            <Text style={[CS.fontM]}>{i18n.t('activity.tryAgain')}</Text>
          </View>
        )}
      </View>
    );
  }
}

let paddingBottom = 0;

const d = Dimensions.get('window');
if (d.height == 812 || d.width == 812) {
  paddingBottom = 16;
}

/**
 * Styles
 */
const styles = StyleSheet.create({
  containerContainer: {
    flex: 1,
    paddingBottom: paddingBottom,
  },
  header: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  actionsContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  title: {
    paddingTop: 12,
    paddingBottom: 8,
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 22,
    // fontWeight: '800',
    fontFamily: 'Roboto-Black', // workaround android ignoring >= 800
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
    flex: 1,
  },
  image: {
    height: 200,
  },
  timestamp: {
    fontSize: 11,
    color: '#888',
  },
  moreInformation: {
    padding: 12,
    flexDirection: 'row',
  },
  messagePoster: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
    backgroundColor: '#FFF',
    padding: 5,
  },
  posterAvatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  input: {
    marginLeft: 8,
  },
  preview: {
    height: 200,
    flexDirection: 'row',
    alignItems: 'stretch',
    position: 'relative',
  },
  deleteAttachment: {
    position: 'absolute',
    right: 8,
    top: 0,
    color: '#FFF',
  },
  sendicon: {
    paddingRight: 8,
  },
  loadCommentsContainer: {
    backgroundColor: '#EEE',
    borderRadius: 3,
    justifyContent: 'center',
    flexDirection: 'row',
    padding: 8,
    margin: 8,
  },
  loadCommentsText: {
    color: '#888',
    fontSize: 10,
  },
  rightToolbar: {
    alignSelf: 'flex-end',
    bottom: 35,
    right: 10,
  },
  icon: {
    color: '#888',
  },
});
