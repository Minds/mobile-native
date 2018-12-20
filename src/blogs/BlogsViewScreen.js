import React, {
  Component
} from 'react';

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
} from 'react-native';

import { inject, observer } from 'mobx-react/native';

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

  state = {
    error: null
  };

  /**
   * Constructor
   * @param {object} props
   */
  constructor(props) {
    super(props);

    const params = props.navigation.state.params;
    this.comments = commentsStoreProvider.get();
  }

  /**
   * Component did mount
   */
  async componentDidMount() {
    const params = this.props.navigation.state.params;

    if (params.blog) {
      this.props.blogsView.setBlog(params.blog);
    } else {
      this.props.blogsView.reset();
      let guid;
      if (params.slug) {
        guid = params.slug.substr(params.slug.lastIndexOf('-')+1);
      } else {
        guid = params.guid;
      }
      try {
        await this.props.blogsView.loadBlog(guid);
      } catch (e) {
        this.setState({error: e});
      }
    }
  }

  /**
   * Render blog
   */
  getHeader() {
    const blog = this.props.blogsView.blog;

    const actions = (
      <View style={[CS.flexContainer, CS.paddingLeft2x]}>
        <View style={styles.actionsContainer}>
          <RemindAction entity={blog} size={16} />
          <ThumbUpAction entity={blog} orientation='column' size={16} me={this.props.user.me} />
          <ThumbDownAction entity={blog} orientation='column' size={16} me={this.props.user.me} />
        </View>
      </View>
    )
    const image = blog.getBannerSource();
    return (
      <View style={styles.screen}>
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
          <Text style={[CS.fontXS, CS.paddingLeft, CS.colorMedium, CS.paddingRight2x]}>{blog.getLicenseText()}</Text>
          <Icon color={colors.primary} size={20} name='share' onPress={this.share} />
        </View>
        <Icon raised color={colors.primary} containerStyle={styles.header} size={30} name='arrow-back' onPress={() => this.props.navigation.goBack()}/>
        { this.comments.loadPrevious && !this.comments.loading ?
            <TouchableHighlight
            onPress={() => { this.loadComments()}}
            underlayColor = 'transparent'
            style = {styles.loadCommentsContainer}
          >
            <Text style={styles.loadCommentsText}> LOAD EARLIER </Text>
          </TouchableHighlight> : null
        }
      </View>
    )
  }

  /**
   * Render
   */
  render() {

    if (!this.props.blogsView.blog) return <CenteredLoading />;
    return (
      <View style={[CS.flexContainer, CS.backgroundWhite]}>
        {
          !this.state.error ?
            <CommentList
              header={this.getHeader()}
              entity={this.props.blogsView.blog}
              store={this.comments}
              navigation={this.props.navigation}
            />
          :
            <View style={CS.flexColumnCentered}>
              <FastImage
                resizeMode={FastImage.resizeMode.contain}
                style={ComponentsStyle.logo}
                source={require('../assets/logos/logo.png')}
              />
              <Text style={[CS.fontL, CS.colorDanger]}>SORRY, WE COULDN'T LOAD THE BLOG</Text>
              <Text style={[CS.fontM]}>PLEASE TRY AGAIN LATER</Text>
            </View>
        }
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
    backgroundColor: '#FFF',
    flex:1
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
  messagePoster: {
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
    backgroundColor: '#FFF',
    padding: 5
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
    color: '#FFF'
  },
  sendicon: {
    paddingRight: 8
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
});