import React, { Component } from 'react';
import {
  StyleSheet,
  View
} from 'react-native';

import {
  observer,
  inject
} from 'mobx-react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import colors from '../styles/Colors';
import { CommonStyle } from '../styles/Common';
import ThemedStyles from '../styles/ThemedStyles';

@inject('notifications')
@observer
export default class NotificacionsTopbar extends Component {

  selected(txt) {
    const filter = this.props.notifications.filter;
    return filter == txt ? styles.tabSelected : null;
  }

  render() {
    const filter = this.props.notifications.filter;

    const bstyle = {borderBottomColor: ThemedStyles.getColor('secondary_background')};

    return (
      <View style={[styles.container, CommonStyle.shadow, ThemedStyles.style.backgroundSecondary]}>
        <View style={styles.topbar}>
          <View style={[styles.tab, bstyle, this.selected('all')]}>
            <Icon name="bell" size={22} style={[styles.button, filter=='all' ? ThemedStyles.style.colorLink : ThemedStyles.style.colorIcon]} onPress={()=> this.props.notifications.setFilter('all')} />
          </View>
          <View style={[styles.tab, bstyle, this.selected('tags')]}>
            <Icon name="tag" size={22} style={[styles.button, filter == 'tags' ? ThemedStyles.style.colorLink : ThemedStyles.style.colorIcon]} onPress={() => this.props.notifications.setFilter('tags')} />
          </View>
          <View style={[styles.tab, bstyle, this.selected('comments')]}>
           <MIcon name="chat-bubble" size={22} style={[styles.button, filter == 'comments' ? ThemedStyles.style.colorLink : ThemedStyles.style.colorIcon]} onPress={() => this.props.notifications.setFilter('comments')} />
          </View>
          <View style={[styles.tab, bstyle, this.selected('boosts')]}>
            <Icon name="trending-up" size={22} style={[styles.button, filter =='boosts' ? ThemedStyles.style.colorLink : ThemedStyles.style.colorIcon]} onPress={() => this.props.notifications.setFilter('boosts')} />
          </View>
          <View style={[styles.tab, bstyle, this.selected('votes')]}>
            <IonIcon name="md-thumbs-up" size={22} style={[styles.button, filter =='votes' ? ThemedStyles.style.colorLink : ThemedStyles.style.colorIcon ]} onPress={() => this.props.notifications.setFilter('votes')} />
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
  },
  tabSelected: {
    borderBottomColor: colors.primary,
  }
});