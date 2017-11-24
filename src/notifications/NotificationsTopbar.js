import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react/native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';

@inject('notifications')
@observer
export default class NotificacionsTopbar extends Component {


  render() {
    const filter = this.props.notifications.filter;

    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <Icon name="bell" size={22} color={filter=='all'?'#D44':'#444'} onPress={()=> this.props.notifications.setFilter('all')} style={styles.button} />
          <Icon name="tag" size={22} color={filter == 'tags' ? '#D44' : '#444'} onPress={() => this.props.notifications.setFilter('tags')} style={styles.button} />
          <IonIcon name="md-chatbubbles" size={22} color={filter == 'comments' ? '#D44' : '#444'} onPress={() => this.props.notifications.setFilter('comments')} style={styles.button} />
          <Icon name="trending-up" size={22} color={filter =='boosts'?'#D44':'#444'} onPress={() => this.props.notifications.setFilter('boosts')} style={styles.button} />
          <IonIcon name="md-thumbs-up" size={22} color={filter =='votes'?'#D44':'#444'} onPress={() => this.props.notifications.setFilter('votes')} style={styles.button} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 56,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 12,
    paddingLeft: 10,
    paddingRight: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: StyleSheet.hairlineWidth,
    shadowOffset: {
      height: StyleSheet.hairlineWidth,
    },
    elevation: 4
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    padding: 8,
  },
});