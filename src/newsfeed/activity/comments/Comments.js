import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
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
      <View style={{flex:1}}>
        <View style={{flex:10}}>
          <ScrollView style={styles.scrollView}>
            <FlatList
              ListHeaderComponent={this.props.header}
              data={this.props.comments}
              renderItem={this.renderComment}
              keyExtractor={item => item.guid}
              onEndThreshold={0.3}
              style={styles.listView}
            />
          </ScrollView>
        </View>
        { this.renderPoster() }
      </View>
    );
  }
  
  renderComment = (row) => {
    const entity = row.item;
    return (
      <Comment comment={entity}/>
    );
  }

  renderPoster() {
    if(!session.isLoggedIn()){
      return (
        <View style={styles.posterWrapper}></View>
      );
    }

    if (!this.props.loading) {
      return (
        <View style={styles.posterWrapper}>
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
                  underlineColorAndroid = 'transparent'
                  onChangeText={(text) => this.setState({text})}
                  value={this.state.text}
                />
                <Icon onPress={() => this.saveComment()} style={{flex: 1}} name="md-send" size={24}></Icon>
              </View>
            }  
          </View>
        </View>
      );
    } else if(this.props.loading) {
      return ( 
        <ActivityIndicator size="small" color="#00ff00" /> 
      );
    } else {
      return (
        <View style={styles.posterWrapper}></View>
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
  scrollView: {
    flex:10
  },
  posterWrapper: {
    flex:1
  },
  commentPoster: {
    flex: 5,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
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