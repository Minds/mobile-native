import React, {
  Component
} from 'react';

import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';
import ConversationView from './conversation/ConversationView';


/**
 * Messenger Conversarion List Screen
 */
@inject('messengerList')
@observer
export default class MessengerScreen extends Component {

  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
      <Icon name="md-chatbubbles" size={24} color={tintColor} />
    )
  }

  /**
   * Render component
   */
  render() {
    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.messengerList.conversations}
          renderItem={this.renderMessage}
          keyExtractor={item => item.guid}
          onRefresh={() => this.props.messengerList.loadList(true)}
          onEndReached={(distanceFromEnd ) => {
            // fix to prevent load data twice on initial state
            if (!this.onEndReachedCalledDuringMomentum) {
              this.props.messengerList.loadList()
              this.onEndReachedCalledDuringMomentum = true;
            }
          }}
          onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false; }}
          onEndThreshold={0.01}
          refreshing={this.props.messengerList.refreshing}
          style={styles.listView}
        />
      </View>
    );
  }
  /**
   * render row
   * @param {object} row
   */
  renderMessage(row) {
    return (
      <ConversationView item={row.item} styles={styles}/>
    );
  }
}

// styles
const styles = StyleSheet.create({
	listView: {
    paddingTop: 20,
    backgroundColor: '#FFF',
  },
  container: {
    flex: 1,
  },
  body: {
    marginLeft: 8,
    flex: 1,
  },
  icons: {
    padding: 5,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    paddingTop: 16,
    paddingLeft: 8,
    paddingBottom: 16,
    paddingRight: 8,
    borderBottomColor: '#EEE',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
});