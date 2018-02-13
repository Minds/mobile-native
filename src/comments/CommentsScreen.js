import React, { Component } from 'react';

import {
  StyleSheet,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { observer, inject } from 'mobx-react/native';

import { extendObservable } from 'mobx';

import Icon from 'react-native-vector-icons/Ionicons';

import CenteredLoading from '../common/components/CenteredLoading';
import Comment from './Comment';

import { getComments, postComment } from './CommentsService';
import session from '../common/services/session.service';
import { CommonStyle } from '../styles/Common';
import { MINDS_CDN_URI } from '../config/Config';

@inject('comments')
@inject('user')
@observer
export default class CommentsScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    header: (
      <View style={styles.header}>
        <Icon size={28} name="ios-close" onPress={() => navigation.goBack()} style={styles.iconclose}/>
      </View>
    ),
    transitionConfig: {
      isModal: true
    }
  })

  state = {
    loading: false,
    text: '',
    entity: this.getEntity(),
    avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/icon/' + this.props.user.guid + '/medium/1511964398' }
  };

  componentWillMount() {
    this.props.comments.clearComments();
    this.loadComments();
  }

  componentWillUnmount() {
    this.props.comments.unlisten();
    this.props.comments.clearComments();
  }

  /**
   * Render
   */
  render() {
    return (
      <KeyboardAvoidingView style={{flex:1}} behavior={ Platform.OS == 'ios' ? 'padding' : 'none' } keyboardVerticalOffset={64}>
        <View style={{flex:14}}>
          { this.props.comments.loaded ?
            <FlatList
              ListHeaderComponent={this.props.header}
              data={this.props.comments.comments.slice()}
              renderItem={this.renderComment}
              keyExtractor={item => item.guid}
              onEndThreshold={0.3}
              onEndReached={this.loadComments}
              initialNumToRender={25}
              refreshing={this.props.comments.refreshing}
              style={styles.listView}
              inverted={true}
            /> :
            <CenteredLoading/>
          }
        </View>
        { this.renderPoster() }
      </KeyboardAvoidingView>
    );
  }

  renderPoster() {
    const avatarImg = { uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid + '/medium' };
    return (
      <View style={styles.messagePoster}>
        <Image source={avatarImg} style={styles.posterAvatar} />
        <TextInput
          style={[CommonStyle.flexContainer, styles.input]}
          editable={true}
          underlineColorAndroid='transparent'
          placeholder='Type your comment...'
          onChangeText={(text) => this.setState({ text })}
          multiline={true}
          autogrow={true}
          maxHeight={110}
          value={this.state.text}
        />
        <TouchableOpacity onPress={() => this.saveComment()} style={styles.sendicon}><Icon name="md-send" size={24} /></TouchableOpacity>
      </View>
    )
  }

  saveComment = () => {
    if(this.state.text.length > 1){
      this.setState({
        loading: true,
      })
      this.props.comments.post(this.state.text).then( (data) => {
        this.setState({
          text:'',
          loading: false,
        })
      });
    }
  }

  getEntity() {
    return this.props.navigation.state.params.entity;
  }

  loadComments = () => {
    const entity = this.state.entity;
    let guid;

    switch (entity.type) {
      case "comment":
        guid = this.state.entity.parent_guid;
        break;

      case "activity":
          guid = this.state.entity.guid;
          if (this.state.entity.entity_guid) {
            guid = this.state.entity.entity_guid;
          }
        break;
      default:
        guid = this.state.entity.guid;
    }

    this.props.comments.loadComments(guid);
  }

  renderComment = (row) => {
    const comment = row.item;

    // add the editing observable property
    extendObservable(comment, {
      editing: false
    });

    return (
      <View>
        <Comment comment={comment} navigation={this.props.navigation}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  author: {
    flex:1,
    alignItems: 'center',
    padding: 8,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  scrollView: {
    flex:10
  },
  posterWrapper: {
    height:50,
  },
  header: {
    backgroundColor: '#F8F8F8',
    paddingTop: Platform.OS == 'ios' ? 14 : 8,
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
  iconclose: {
    alignSelf: 'flex-end',
    padding: Platform.OS == 'ios' ? 10 : 8
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
  avatar: {
    height: 24,
    width: 24,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  listView: {
    backgroundColor: '#FFF',
    flex: 1,
  }
});