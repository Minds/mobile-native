import React, {
  Component
} from 'react';

import {
  inject,
  observer
} from "mobx-react/native";

import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View
} from 'react-native';

import { CommonStyle } from '../../styles/Common';

/**
 * Newsfeed top bar
 */
@inject('newsfeed')
@observer
export default class Topbar extends Component {

  selected(txt) {
    const filter = this.props.newsfeed.filter;
    return filter == txt ? styles.tabSelected : null;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.topbar}>
          <TouchableOpacity style={[styles.tab, this.selected('top')]} onPress={() => this.props.newsfeed.setFilter('top')}>
            <Text style={CommonStyle.fontXS}>TOP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, this.selected('subscribed')]} onPress={() => this.props.newsfeed.setFilter('subscribed')}>
            <Text style={CommonStyle.fontXS}>SUBSCRIBED</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, this.selected('boostfeed')]} onPress={() => this.props.newsfeed.setFilter('boostfeed')}>
            <Text style={CommonStyle.fontXS}>BOOSTFEED</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
}

//TODO: move to common style
const styles = StyleSheet.create({
  container: {
    height: 30,
    display: 'flex',
    flexDirection: 'row',
    paddingTop: 5,
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
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#FFF',
  },
  tabSelected: {
    borderBottomColor: '#AAF',
  }
});