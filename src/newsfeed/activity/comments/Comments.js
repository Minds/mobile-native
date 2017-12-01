import React, { Component } from 'react';
import { ListView, StyleSheet, View } from 'react-native';
import { observer, inject } from 'mobx-react/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Comment from './Comment';

export default class Comments extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-home" size={24} color={tintColor} />
    )
  }

  render() {
    return (
      <View>
        {
          this.props.comments.map((l, i) => (
            <Comment key={i} comment={l}/>
          ))
        }
      </View>
    );
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
  }
});