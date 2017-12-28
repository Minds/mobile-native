import React, {
  Component
} from 'react';

import {
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  StyleSheet
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import Async from 'react-promise'

import Icon from 'react-native-vector-icons/Ionicons';
import { MINDS_URI } from '../config/Config';

import crypto from './../common/services/crypto.service';

// styles
const styles = StyleSheet.create({
  listView: {
    flex: 1
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: '#FFF',
  },
  tbarbutton: {
    padding: 8,
  },
  messageContainer: {
    marginTop: 20,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
    flexGrow: 1,
    width: '100%'
    // alignSelf: 'baseline',
  },
  right: {
    justifyContent: 'flex-end',
  },
  rightText: {
    textAlign: 'right',
  },
  messagePoster: {
    height: 50,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
  },
  input: {
    flex: 1
  },
  sendicon: {
    width:25
  },
  smallavatar: {
    height: 28,
    width: 28,
    borderRadius: 14,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  textContainer: {
    flexGrow: 1,
    width: 0,
    flexDirection: "column",
    justifyContent: "center"
  },
  message: {
    paddingLeft:10,
    paddingRight:10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 3,
    backgroundColor: '#EEE',
    marginLeft:10,
    marginRight:10,
    flexWrap: "wrap",
    flexGrow: 1,
  },
  messagedate: {
    fontSize:9,
    marginLeft: 38,
    marginRight: 38
  }
});

/**
 * Messenger Conversation Screen
 */
@inject('user')
@inject('messengerList')
@observer
export default class ConversationScreen extends Component {

  state = {
    text: ''
  }

  static navigationOptions = ({ navigation }) => ({
    headerRight: <Icon name="ios-options" size={18} color='#444' style={styles.tbarbutton}/>
  });

  componentWillMount() {
    const conversation = this.props.navigation.state.params.conversation;
    this.props.messengerList.loadMessages(conversation.guid);
  }

  componentWillUnmount() {
    this.props.messengerList.clearMessages();
  }

  /**
   * Render component
   */
  render() {
    const messages = this.props.messengerList.messages;
    const conversation = this.props.navigation.state.params.conversation;
    const avatarImg    = { uri: MINDS_URI + 'icon/' + this.props.user.me.guid + '/medium' };

    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          renderItem={this.renderMessage}
          keyExtractor={item => item.guid}
          style={styles.listView}
        />
        <View style={styles.messagePoster}>
          <Image source={avatarImg} style={styles.avatar} />
          <TextInput
            style={styles.input}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='Type your message...'
            // onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <Icon style={styles.sendicon} name="md-send" size={24}></Icon>
        </View>
      </View>
    );
  }

  /**
   * render row
   * @param {object} row
   */
  renderMessage = (row) => {
    const avatarImg = { uri: MINDS_URI + 'icon/' + row.item.owner.guid + '/small' };

    const decrypPromise = crypto.decrypt(row.item.message);

    if (row.item.owner.guid == this.props.user.me.guid) {
      return (
        <View>
          <View style={styles.messageContainer}>
            <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
            <View style={styles.textContainer}>
              <Async
                promise={decrypPromise}
                then={(val) => <Text style={styles.message}>{val}</Text>}
                pending={<Text style={styles.message}>decrypting...</Text>}
                />
            </View>
          </View>
          <Text style={styles.messagedate}>Dec 6, 2017, 11:47:46 AM</Text>
        </View>
      );
    }

    return (
      <View>
        <View style={[styles.messageContainer, styles.right]}>
          <View style={styles.textContainer}>
            <Async
              promise={decrypPromise}
              then={(val) => <Text style={styles.message}>{val}</Text>}
              pending={<Text style={styles.message}>decrypting...</Text>}
            />
          </View>
          <Image source={avatarImg} style={[styles.avatar, styles.smallavatar]} />
        </View>
        <Text style={[styles.messagedate, styles.rightText]}>Dec 6, 2017, 11:47:46 AM</Text>
      </View>
    );
  }
}

