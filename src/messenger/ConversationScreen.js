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
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

import {
  inject,
  observer
} from 'mobx-react/native'

import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_CDN_URI } from '../config/Config';
import crypto from './../common/services/crypto.service';
import Message from './conversation/Message';
import MessengerSetup from './MessengerSetup';

/**
 * Messenger Conversation Screen
 */
@inject('user')
@inject('messengerConversation', 'messengerList')
@observer
export default class ConversationScreen extends Component {

  state = {
    text: ''
  }

  componentWillMount() {
    let conversation;
    if(this.props.navigation.state.params.conversation) {
      conversation = this.props.navigation.state.params.conversation;
    } else {
      conversation = this.props.navigation.state.params.target;
    }

    // load conversation
    this.props.messengerConversation.setGuid(conversation.guid);
    this.props.messengerConversation.load();
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

    const messengerList = this.props.messengerList;

    const shouldSetup = !messengerList.configured;

    // show setup !configured yet
    if (shouldSetup) {
      return <MessengerSetup/>
    }

    const messages = this.props.messengerConversation.messages;
    const conversation = this.props.navigation.state.params.conversation;
    const avatarImg    = { uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid + '/medium/' + this.props.user.me.icontime };
    return (
      <KeyboardAvoidingView style={styles.container} behavior={ Platform.OS == 'ios' ? 'padding' : 'none'} keyboardVerticalOffset={64}>
        <FlatList
          inverted={true}
          data={messages.slice()}
          ref={(c) => {this.list = c}}
          renderItem={this.renderMessage}
          maxToRenderPerBatch={15}
          keyExtractor={item => item.guid}
          style={styles.listView}
          windowSize={11}
        />
        <View style={styles.messagePoster} >
          <Image source={avatarImg} style={styles.avatar} />
          <TextInput
            style={styles.input}
            editable={true}
            underlineColorAndroid='transparent'
            placeholder='Type your message...'
            onChangeText={(text) => this.setState({ text })}
            multiline={true}
            autogrow={true}
            maxHeight={110}
            value={this.state.text}
          />
          <TouchableOpacity onPress={this.send} style={styles.sendicon}><Icon name="md-send" size={24} style={{ color: '#444' }}/></TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    );
  }

  /**
   * Send message
   */
  send = () => {
    const conversationGuid = this.props.navigation.state.params.conversation.guid;
    const myGuid = this.props.user.me.guid
    const msg  = this.state.text;
    this.props.messengerConversation.send(myGuid, msg)
      .catch(err=> {
        console.log(err);
      })
    this.setState({text: ''})
    setTimeout(() => {
      this.list.scrollToOffset({ offset: 0, animated: false });
    }, 100);
  }

  /**
   * render row
   * @param {object} row
   */
  renderMessage = (row) => {
    return <Message message={row.item} right={row.item.owner.guid == this.props.user.me.guid} navigation={this.props.navigation}/>
  }

}

const d = Dimensions.get('window');

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
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: '#ccc',
    flexDirection: 'row',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'baseline',
    padding: 8,

    ... (d.height == 812) ? {
      paddingTop: 4,
      paddingBottom: 24,
    } : {}
  },
  tbarbutton: {
    padding: 8,
  },
  avatar: {
    height: 36,
    width: 36,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#EEE',
  },
  input: {
    flex: 1,
    paddingLeft: 8,
  },
  sendicon: {
    width:25
  },
});