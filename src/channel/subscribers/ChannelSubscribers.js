import React, {
    Component
} from 'react';

import {
    StyleSheet,
    Platform,
    Text,
    FlatList,
    View,
    TouchableHighlight,
} from 'react-native';
import { ListItem, Avatar } from 'react-native-elements';

import {
  observer,
  inject
} from 'mobx-react/native'

import IonIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialIcons';

import Modal from 'react-native-modal'

import DiscoveryUser from '../../discovery/DiscoveryUser';
import CenteredLoading from '../../common/components/CenteredLoading';
import { CommonStyle } from '../../styles/Common';
import colors from '../../styles/Colors';


/**
 * Discovery screen
 */
@inject('channelSubscribersStore')
@observer
export default class ChannelSubscribers extends Component {

  /**
   * On component will mount
   */
  componentWillMount() {
    this._loadData();
  }

  /**
   * Load data
   */
  _loadData() {
    const params = this.props.navigation.state.params;
    if (params.guid) {
      this.props.channelSubscribersStore.setGuid(params.guid);
    }
  }

  /**
   * Render
   */
  render() {
    let body;

    const channels = this.props.channelSubscribersStore;

    if (!channels.list.loaded) {
      body = <CenteredLoading />
    } else {
      body = (
        <FlatList
          data={channels.list.entities.slice()}
          renderItem={this.renderRow}
          keyExtractor={item => item.guid}
          onRefresh={this.refresh}
          refreshing={channels.list.refreshing}
          onEndReached={this.loadFeed}
          onEndThreshold={0}
          initialNumToRender={12}
          style={styles.listView}
          removeClippedSubviews={false}
        />
      )
    }

    return (
      <View style={CommonStyle.flexContainer}>
        <View style={styles.topbar}>
          <View style={[CommonStyle.flexContainer, CommonStyle.rowJustifyCenter]}>
            <TouchableHighlight underlayColor='transparent' onPress={() => channels.setFilter('subscribers')} style={channels.filter == 'subscribers'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter]}>
              <Text>Subscribers</Text>
            </TouchableHighlight>
            <TouchableHighlight underlayColor='transparent' onPress={() => channels.setFilter('subscriptions')} style={channels.filter == 'subscriptions'? [styles.selectedButton, CommonStyle.flexContainerCenter]: [styles.buttons, CommonStyle.flexContainerCenter ]}>
              <Text>Subscriptions</Text>
            </TouchableHighlight>
          </View>
        </View>
        {body}
      </View>
    );
  }


  /**
   * Load subs data
   */
  loadFeed = () => {
    this.props.channelSubscribersStore.loadList(this.props.guid);
  }

  /**
   * Refresh subs data
   */
  refresh = () => {
    this.props.channelSubscribersStore.refresh(this.props.guid)
  }

  /**
   * Render user row
   */
  renderRow = (row) => {
    return (
      <DiscoveryUser store={this.props.channelSubscribersStore} entity={row} navigation={this.props.navigation} />
    );
  }
}

const styles = StyleSheet.create({
	listView: {
    backgroundColor: '#FFF',
    flex: 1,
  },
  topbar: {
    height:35,
    justifyContent: 'center',
    flexDirection: 'row',
    
  },

  buttons: {
    alignItems: 'center',
  },
  selectedButton: {
    alignItems: 'center',
    borderBottomWidth:3,
    borderColor: colors.primary
  },
});