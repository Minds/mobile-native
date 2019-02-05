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
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';

@inject('notifications')
@observer
export default class NotificacionsTopbar extends Component {

  selected(txt) {
    const filter = this.props.notifications.filter;
    return filter == txt ? styles.tabSelected : null;
  }

  render() {
    const filter = this.props.notifications.filter;

    return (
      <View style={[styles.container, CommonStyle.shadow]}>
        <View style={styles.topbar}>
          <View style={[styles.tab, this.selected('all')]}>
            <Icon name="bell" size={22} color={filter=='all' ? colors.primary : color} onPress={()=> this.props.notifications.setFilter('all')} style={styles.button} />
          </View>
          <View style={[styles.tab, this.selected('tags')]}>
            <Icon name="tag" size={22} color={filter == 'tags' ? colors.primary : color} onPress={() => this.props.notifications.setFilter('tags')} style={styles.button} />
          </View>
          <View style={[styles.tab, this.selected('comments')]}>
           <MIcon name="chat-bubble" size={22} color={filter == 'comments' ? colors.primary : color} onPress={() => this.props.notifications.setFilter('comments')} style={styles.button} />
          </View>
          <View style={[styles.tab, this.selected('boosts')]}>
            <Icon name="trending-up" size={22} color={filter =='boosts' ? colors.primary : color} onPress={() => this.props.notifications.setFilter('boosts')} style={styles.button} />
          </View>
          <View style={[styles.tab, this.selected('votes')]}>
            <IonIcon name="md-thumbs-up" size={22} color={filter =='votes' ? colors.primary : color } onPress={() => this.props.notifications.setFilter('votes')} style={styles.button} />
          </View>
        </View>
      </View>
    );
  }
}

const color = '#444';

const styles = StyleSheet.create({
  container: {
    height: 45,
    display: 'flex',
    flexDirection: 'row',
    paddingTop:5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#EEE',
    backgroundColor: '#FFF',
  },
  topbar: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  button: {
    padding: 8,
  },
  tab: {
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabSelected: {
    borderBottomColor: colors.primary,
  }
});