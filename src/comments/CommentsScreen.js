import React, { Component } from 'react';
import { ListView, StyleSheet, View,ScrollView, FlatList, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';

import CenteredLoading from '../common/components/CenteredLoading';
import Comment from './Comment';

import { getComments, postComment } from './CommentsService';
import session from '../common/services/session.service';

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

  componentWillUnount() {
    this.props.comments.clearComments();
  }

  render() {
    return (
      <View style={{flex:1}}>
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
            /> : 
            <CenteredLoading/>
          }
        </View>
        { this.renderPoster() }
      </View>
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
          </View>
        </View>
      );
    } else if (this.props.loading || this.props.loading) {
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
    let guid = this.state.entity.guid;
    if (this.state.entity.entity_guid)
      guid = this.state.entity.entity_guid;
    this.props.comments.loadComments(guid);
  }

  renderComment=(row) => {
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
  },
  commentPoster: {
    flex: 5,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
  },
  iconclose: {
    alignSelf: 'flex-end',
    padding: 10
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