import React, {
  Component
} from 'react';

import {
  Text,
  View,
  Image,
  TextInput,
  FlatList,
  StyleSheet,
  TouchableOpacity
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_URI } from '../config/Config';
import crypto from './../common/services/crypto.service';
import Message from './conversation/Message';

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
  messagePoster: {
    height: 50,
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
  },
  tbarbutton: {
    padding: 8,
  },
  input: {
    flex: 1
  },
  sendicon: {
    width:25
  },
});

/**
 * Messenger Conversation Screen
 */
@inject('user')
@inject('messengerConversation')
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
    // load conversation
    this.props.messengerConversation.load(conversation.guid);
  }

  /**
   * Clear messages on unmount
   */
  componentWillUnmount() {
    // clear messages from store
    this.props.messengerConversation.clear();
    // clear public keys
    crypto.setPublicKeys({});
  }

  /**
   * Render component
   */
  render() {
    const messages = this.props.messengerConversation.messages;
    const conversation = this.props.navigation.state.params.conversation;
    const avatarImg    = { uri: MINDS_URI + 'icon/' + this.props.user.me.guid + '/medium' };

    return (
      <View style={styles.container}>
        <FlatList
          data={messages}
          ref={(c) => {this.list = c}}
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
            onChangeText={(text) => this.setState({ text })}
            value={this.state.text}
          />
          <TouchableOpacity onPress={this.send} style={styles.sendicon}><Icon name="md-send" size={24} /></TouchableOpacity>
        </View>
      </View>
    );
  }

  /**
   * Send message
   */
  send = () => {
    const guid = this.props.navigation.state.params.conversation.guid;
    const msg  = this.state.text;
    this.props.messengerConversation.send(guid, msg)
      .catch(err=> {
        console.log(err);
      })
    this.setState({text: ''})
    setTimeout(() => {
      this.list.scrollToEnd({ animated: false });
    }, 100);
  }

  /**
   * render row
   * @param {object} row
   */
  renderMessage = (row) => {
    return <Message message={row.item} right={row.item.owner.guid == this.props.user.me.guid}/>
  }
}

