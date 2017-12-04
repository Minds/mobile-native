import React, { Component } from 'react';
import { ListView, StyleSheet, View, TextInput, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Comment from './Comment';

export default class Comments extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  state = {
    text: '',
    avatarSrc: { uri: 'https://d3ae0shxev0cb7.cloudfront.net/icon/747562985026756623/medium/1511964398' }
  };

  render() {
    return (
      <View>
        {
          this.props.comments.map((l, i) => (
            <Comment key={i} comment={l}/>
          ))
        }
        { this.renderPoster() }
      </View>
    );
  }

  renderPoster() {
    if (this.props.loadedComments && !this.props.loading) {
      return (
        <View style={styles.container}>
          <View style={styles.author}>
            <TouchableOpacity>
              <Image source={this.state.avatarSrc} style={styles.avatar}/>
            </TouchableOpacity>
          </View>
          <View style={styles.commentPoster}>
            <TextInput
              editable = {true}
              maxLength = {40}
              onChangeText={(text) => this.setState({text})}
              value={this.state.text}
            />
          </View>
        </View>
      );
    } else if(this.props.loading) {
      return( <ActivityIndicator size="small" color="#00ff00" /> );
    } else {
      return (<View></View>);
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
  },
  avatar: {
    height: 46,
    width: 46,
    borderRadius: 23,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});