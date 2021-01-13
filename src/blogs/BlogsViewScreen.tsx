import { inject, observer } from 'mobx-react';
import React, { Component } from 'react';

import {
  Alert,
  Dimensions,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Icon } from 'react-native-elements';
import FastImage from 'react-native-fast-image';
import { ScrollView } from 'react-native-gesture-handler';
import CommentBottomSheet from '../comments/v2/CommentBottomSheet';
import CenteredLoading from '../common/components/CenteredLoading';
import SmartImage from '../common/components/SmartImage';
import formatDate from '../common/helpers/date';
import { FLAG_VIEW } from '../common/Permissions';
import i18n from '../common/services/i18n.service';
import logService from '../common/services/log.service';
import RemindAction from '../newsfeed/activity/actions/RemindAction';
import ThumbDownAction from '../newsfeed/activity/actions/ThumbDownAction';
import ThumbUpAction from '../newsfeed/activity/actions/ThumbUpAction';
import CommentsAction from '../newsfeed/activity/actions/CommentsAction';
import OwnerBlock from '../newsfeed/activity/OwnerBlock';
import shareService from '../share/ShareService';
import colors from '../styles/Colors';
import ThemedStyles from '../styles/ThemedStyles';
import Lock from '../wire/v2/lock/Lock';
import BlogActionSheet from './BlogActionSheet';

import BlogViewHTML from './BlogViewHTML';
import type BlogsViewStore from './BlogsViewStore';
import { AppStackParamList } from '../navigation/NavigationTypes';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { ComponentsStyle } from '../styles/Components';

type BlogScreenRouteProp = RouteProp<AppStackParamList, 'BlogView'>;
type BlogScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'BlogView'
>;

type PropsType = {
  blogsView: BlogsViewStore;
  route: BlogScreenRouteProp;
  navigation: BlogScreenNavigationProp;
};

/**
 * Blog View Screen
 */
@inject('user', 'blogsView')
@observer
export default class BlogsViewScreen extends Component<PropsType> {
  listRef: any;
  commentsRef: any;

  /**
   * Disable navigation bar
   */
  static navigationOptions = {
    header: null,
  };

  share = () => {
    const blog = this.props.blogsView.blog;
    if (blog) {
      shareService.share(blog.title, blog.perma_url);
    }
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

    this.listRef = React.createRef();
    this.commentsRef = React.createRef();
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
        await this.props.blogsView.setBlog(params.blog);

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
      if (!this.props.blogsView.blog?.can(FLAG_VIEW, true)) {
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
    if (blog && blog._list && blog._list.metadataService) {
      blog._list.metadataService.popSource();
    }
    this.props.blogsView.reset();
  }

  /**
   * On HTML height updated
   */
  onHeightUpdated = () => {
    const params = this.props.route.params;
    if (params && params.scrollToBottom && this.listRef.current) {
      this.listRef.current.scrollToBottom();
    }
  };

  /**
   * Render blog
   */
  getBody() {
    const blog = this.props.blogsView.blog;
    if (!blog) return null;

    const theme = ThemedStyles.style;

    const actions = !blog.paywall ? (
      <View style={[theme.paddingHorizontal2x, theme.rowJustifySpaceBetween]}>
        <ThumbUpAction entity={blog} />
        <ThumbDownAction entity={blog} />
        <CommentsAction
          entity={blog}
          navigation={this.props.navigation}
          onPressComment={() => {
            this.commentsRef.current.expand();
          }}
        />
        <RemindAction entity={blog} />
      </View>
    ) : null;
    const image = blog.getBannerSource();

    return (
      <View style={[styles.screen, theme.backgroundSecondary]}>
        <SmartImage
          source={image}
          resizeMode={FastImage.resizeMode.cover}
          style={styles.image}
        />
        <Text style={styles.title}>{blog.title}</Text>
        <View style={[styles.actionSheet]}>
          <BlogActionSheet entity={blog} navigation={this.props.navigation} />
        </View>
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
            <BlogViewHTML
              html={blog.description}
              onHeightUpdated={this.onHeightUpdated}
            />
          ) : blog.paywall ? (
            <Lock entity={blog} navigation={this.props.navigation} />
          ) : (
            <CenteredLoading />
          )}
        </View>
        {!blog.paywall && (
          <View style={styles.moreInformation}>
            {Boolean(blog.getLicenseText()) && (
              <Icon color={colors.medium} size={18} name="public" />
            )}
            <Text
              style={[
                theme.fontXS,
                theme.paddingLeft,
                theme.colorMedium,
                theme.paddingRight2x,
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
        )}
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

  async handleActionSheetSelection(option) {
    switch (option) {
      case i18n.t('disableComments'):
      case i18n.t('enableComments'):
        try {
          await this.props.blogsView.blog?.toggleAllowComments();
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
      [
        {
          text: i18n.t('ok'),
          onPress: () => {},
        },
      ],
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
      <View style={[theme.flexContainer, theme.backgroundSecondary]}>
        {!this.state.error ? (
          <>
            <ScrollView ref={this.listRef}>{this.getBody()}</ScrollView>
            {this.props.blogsView.comments && (
              <CommentBottomSheet
                ref={this.commentsRef}
                hideContent={false}
                commentsStore={this.props.blogsView.comments}
              />
            )}
          </>
        ) : (
          <View style={theme.flexColumnCentered}>
            <FastImage
              resizeMode={FastImage.resizeMode.contain}
              style={ComponentsStyle.logo}
              source={require('../assets/logos/logo.png')}
            />
            <Text style={[theme.fontL, theme.colorDanger]}>
              {i18n.t('blogs.error')}
            </Text>
            <Text style={[theme.fontM]}>{i18n.t('activity.tryAgain')}</Text>
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
  actionSheet: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
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
