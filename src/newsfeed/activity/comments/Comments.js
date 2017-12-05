import React, { Component } from 'react';
import { ListView, StyleSheet, View, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Comment from './Comment';

import { getComments, postComment } from './CommentsService';
import session from '../../../common/services/session.service';

@inject('user')
@observer
export default class Comments extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  state = {
    isLoading: false,
    text: '',
    comments: [],
    avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/icon/' + this.props.user.guid + '/medium/1511964398' }
  };

  render() {
    return (
      <View style={styles.commentList}>
        { this.props.comments.map((l, i) => (
            <Comment key={i} comment={l}/>
          )) 
        }
        { this.state.comments.map((l, i) => (
            <Comment key={i} comment={l}/>
          )) 
        }
        { this.renderPoster() }
      </View>
    );
  }

  renderPoster() {
    if(!session.isLoggedIn()){
      return (
        <View></View>
      );
    }

    if (this.props.loadedComments && !this.props.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.author}>
            <TouchableOpacity>
              <Image source={this.state.avatarSrc} style={styles.avatar}/>
            </TouchableOpacity>
          </View>
          { this.state.isLoading ? 
            <ActivityIndicator size="small" color="#00ff00" /> 
              :
            <View style={styles.commentPoster}>
              <TextInput
                style={{flex: 5}}
                editable = {true}
                maxLength = {40}
                onChangeText={(text) => this.setState({text})}
                value={this.state.text}
              />
              <Icon onPress={() => this.saveComment()} style={{flex: 1}} name="ios-send" size={36}></Icon>
            </View>
          }  
        </View>
      );
    } else if(this.props.loading) {
      return ( 
        <ActivityIndicator size="small" color="#00ff00" /> 
      );
    } else {
      return (
        <View></View>
      );
    }
    
  }

  saveComment = () => {
    let comments = this.state.comments;
    if(this.state.text.length > 1){
      this.setState({
        isLoading: true,
      });
      postComment(this.props.guid, this.state.text).then((data) => {
        comments.push(data.comment);
        this.setState({
          comments: comments,
          text: '',
          isLoading: false,
        });
      })
      .catch(err => {
        console.log('error');
      })
    }
    
  }

  renderComments=(row) => {
    const comment = row.item;
    return (
      <View>
        <Comment comment={comment}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
	listView: {
    //paddingTop: 20,
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
  commentPoster: {
    flex: 5,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  commentList: {
    paddingLeft: 10
  }
});