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
  ActivityIndicator
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
import MessengerInvite from './MessengerInvite';

import { CommonStyle } from '../styles/Common';
import UserModel from '../channel/UserModel';
import MessengerConversationStore from './MessengerConversationStore';

/**
 * Messenger Conversation Screen
 */
@inject('user')
@inject('messengerList')
@observer
export default class ConversationScreen extends Component {

  state = {
    text: '',
  }
  topAvatar = false;
  store;

  static navigationOptions = ({ navigation }) => {
    const conversation = navigation.state.params.conversation;

    if (!conversation || !conversation.name) {
      return {
        title: ''
      };
    }

    return {
      title: conversation.name,
      headerRight: navigation.state.params && navigation.state.params.headerRight,
    }
  };

  componentWillMount() {
    this.store = new MessengerConversationStore();
    const params = this.props.navigation.state.params;
    let conversation;
    if(params.conversation) {
      conversation = params.conversation;
    } else {
      // open conversation with params.target user (minor guid go first)
      if (params.target > this.props.user.me.guid) {
        conversation = {guid: `${this.props.user.me.guid}:${params.target}`};
      } else {
        conversation = {guid: `${params.target}:${this.props.user.me.guid}`};
      }
    }

    if (this.props.messengerList.configured) {
      this.updateTopAvatar(conversation);
    }

    // load conversation
    this.store.setGuid(conversation.guid);
    this.store.load()
      .then(conversation => {
        // we send the conversation to update the topbar (in case we only receive the guid)
        this.props.navigation.setParams({ conversation });
      });
    this.store.load(); //iOS needs to be preloaded
  }

  /**
   * Update top avatar
   * @param {object} conversation
   */
  updateTopAvatar(conversation) {
    if (conversation && conversation.participants && !this.topAvatar) {
      const participant = UserModel.checkOrCreate(conversation.participants[0]);
      const avatarImg = participant.getAvatarSource();

      this.props.navigation.setParams({
        headerRight: (
          <TouchableOpacity style={[CommonStyle.rowJustifyEnd, CommonStyle.paddingRight2x]}  onPress={() => this.props.navigation.navigate('Channel', { guid:participant.guid})}>
            <Image source={avatarImg} style={styles.avatar} />
          </TouchableOpacity>)
      });

      this.topAvatar = true;
    }
  }

  /**
   * Navigate To channel
   */
  _navToChannel = () => {
    // only active if receive the navigation property
    if (this.props.navigation) {
      this.props.navigation.navigate('Channel', { guid:this.props.comment.ownerObj.guid});
    }
  }

  /**
   * Clear messages on unmount
   */
  componentWillUnmount() {
    // clear messages from store
    this.store.clear();
    // clear public keys
    crypto.setPublicKeys({});
  }

  /**
   * Load more
   */
  loadMore = async () => {
    const conversation = await this.store.load();

    // update top avatar if it is not set
    this.updateTopAvatar(conversation);
  }

  /**
   * Render component
   */
  render() {

    const messengerList = this.props.messengerList;
    const shouldSetup = !messengerList.configured;
    const shouldInvite = this.store.invitable;
    let footer = null;

    // show setup !configured yet
    if (shouldSetup) {
      return <MessengerSetup navigation={this.props.navigation} />
    }

    if (this.store.loading) {
      footer = <ActivityIndicator animating size="large" />
    }

    if (shouldInvite) {
      return <MessengerInvite navigation={this.props.navigation} messengerConversation={this.store}/>
    }

    const messages = this.store.messages.slice();

    const conversation = this.props.navigation.state.params.conversation;
    const avatarImg    = { uri: MINDS_CDN_URI + 'icon/' + this.props.user.me.guid + '/medium/' + this.props.user.me.icontime };
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS == 'ios' ? 'padding' : null} keyboardVerticalOffset={64}>
        <FlatList
          inverted={true}
          data={messages}
          ref={(c) => {this.list = c}}
          renderItem={this.renderMessage}
          maxToRenderPerBatch={15}
          keyExtractor={item => item.rowKey}
          style={styles.listView}
          ListFooterComponent={footer}
          windowSize={3}
          onEndReached={this.loadMore}
          onEndThreshold={0}
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
  send = async () => {
    const conversationGuid = this.store.guid;
    const myGuid = this.props.user.me.guid;
    const msg  = this.state.text;

    try {
      const result = await this.store.send(myGuid, msg);
    } catch(err) {
      console.log('error', err);
    }
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
