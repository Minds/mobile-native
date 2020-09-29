//@ts-nocheck
import React, { Component } from 'react';

import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  SafeAreaView,
} from 'react-native';

import { inject, observer } from 'mobx-react';

import Icon from 'react-native-vector-icons/Ionicons';

import { MINDS_CDN_URI } from '../config/Config';
import crypto from './../common/services/crypto.service';
import Message from './conversation/Message';
import MessengerSetup from './MessengerSetup';
import MessengerInvite from './MessengerInvite';

import { CommonStyle } from '../styles/Common';
import UserModel from '../channel/UserModel';
import MessengerConversationStore from './MessengerConversationStore';
import ErrorLoading from '../common/components/ErrorLoading';
import logService from '../common/services/log.service';
import TextInput from '../common/components/TextInput';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';
import isIphoneX from '../common/helpers/isIphoneX';
import ActivityIndicator from '../common/components/ActivityIndicator';

const keyExtractor = (item) => item.rowKey;

/**
 * Messenger Conversation Screen
 */
@inject('user')
@inject('messengerList')
@observer
export default class ConversationScreen extends Component {
  state = {
    text: '',
  };
  topAvatar = false;
  store;

  setNavigationOptions = ({ route }) => {
    const conversation = route.params.conversation;
    let title = '';

    if (conversation) {
      title = conversation.name ? conversation.name : conversation.username;
    }

    return {
      title,
      headerRight: route.params && route.params.headerRight,
    };
  };

  componentWillMount() {
    this.store = new MessengerConversationStore();
    const params = this.props.route.params;
    let conversation;
    if (params.conversation) {
      conversation = params.conversation;
      conversation.unread = false;
    } else {
      // open conversation with params.target user (minor guid go first)
      if (params.target > this.props.user.me.guid) {
        conversation = { guid: `${this.props.user.me.guid}:${params.target}` };
      } else {
        conversation = { guid: `${params.target}:${this.props.user.me.guid}` };
      }
    }

    this.store.setGuid(conversation.guid);

    if (this.props.messengerList.configured) {
      this.updateTopAvatar(conversation);
      // load conversation
      this.store.load().then((conv) => {
        // we send the conversation to update the topbar (in case we only receive the guid)
        this.updateTopAvatar(conv);
      });
    }
  }

  /**
   * Update top avatar
   * @param {object} conversation
   */
  updateTopAvatar(conversation) {
    // do not update the avatar if it is not configured yet
    if (!this.props.messengerList.configured) return;

    if (conversation && conversation.participants && !this.topAvatar) {
      const participant = UserModel.checkOrCreate(conversation.participants[0]);
      const avatarImg = participant.getAvatarSource();

      this.props.navigation.setOptions({
        title: participant.name,
        headerRight: () => (
          <TouchableOpacity
            style={[CommonStyle.rowJustifyEnd, CommonStyle.paddingRight2x]}
            onPress={() =>
              this.props.navigation.push('Channel', { guid: participant.guid })
            }>
            <Image source={avatarImg} style={styles.avatar} />
          </TouchableOpacity>
        ),
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
      this.props.navigation.push('Channel', {
        guid: this.props.comment.ownerObj.guid,
      });
    }
  };

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
  loadMore = async (e, force = false) => {
    if (this.store.errorLoading && !force) return;

    const conversation = await this.store.load();

    // update top avatar if it is not set
    this.updateTopAvatar(conversation);
  };

  /**
   * Load more
   */
  loadMoreForce = async () => {
    return this.loadMore(null, true);
  };

  onDoneSetup = async () => {
    const conversation = await this.store.load(true);
    this.updateTopAvatar(conversation);
  };

  /**
   * Set list ref
   */
  setRef = (c) => {
    this.list = c;
  };

  /**
   * Render component
   */
  render() {
    const messengerList = this.props.messengerList;
    const shouldSetup = !messengerList.configured;
    const shouldInvite = this.store.invitable;

    // show setup !configured yet
    if (shouldSetup) {
      return (
        <MessengerSetup
          navigation={this.props.navigation}
          onDone={this.onDoneSetup}
        />
      );
    }

    if (shouldInvite) {
      return (
        <MessengerInvite
          navigation={this.props.navigation}
          messengerConversation={this.store}
        />
      );
    }

    const footer = this.getFooter();
    const messages = this.store.messages.slice();
    const avatarImg = {
      uri:
        MINDS_CDN_URI +
        'icon/' +
        this.props.user.me.guid +
        '/medium/' +
        this.props.user.me.icontime,
    };
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={[styles.container, ThemedStyles.style.backgroundSecondary]}
          behavior={Platform.OS === 'ios' ? 'padding' : null}
          keyboardVerticalOffset={isIphoneX ? 100 : 64}>
          <FlatList
            inverted={true}
            data={messages}
            ref={this.setRef}
            renderItem={this.renderMessage}
            maxToRenderPerBatch={15}
            keyExtractor={keyExtractor}
            style={styles.listView}
            ListFooterComponent={footer}
            windowSize={3}
            onEndReached={this.loadMore}
            // onEndReachedThreshold={0}
          />
          <Text style={styles.characterCounter}>
            {this.state.text.length} / 180
          </Text>
          <View style={styles.messagePoster}>
            <Image source={avatarImg} style={styles.avatar} />
            <TextInput
              style={[styles.input, ThemedStyles.style.colorPrimaryText]}
              editable={true}
              underlineColorAndroid="transparent"
              placeholder={i18n.t('messenger.typeYourMessage')}
              placeholderTextColor={ThemedStyles.getColor('secondary_text')}
              onChangeText={this.textChanged}
              multiline={true}
              autogrow={true}
              maxHeight={110}
              value={this.state.text}
              testID="ConversationTextInput"
            />
            <TouchableOpacity
              onPress={this.send}
              style={styles.sendicon}
              testID="ConversationSendButton">
              <Icon
                name="md-send"
                size={24}
                style={ThemedStyles.style.colorIcon}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  /**
   * Checks whether a message contains more than 180 characters,
   * if it does not, sets the text state to the string passed in.
   *
   * @param { string } text - the text to be checked
   */
  textChanged = (text) => {
    if (text.length > 180) {
      return;
    }
    this.setState({ text: text });
  };

  /**
   * Get list header
   */
  getFooter() {
    if (this.store.loading) {
      return <ActivityIndicator animating size="large" />;
    }
    if (!this.store.errorLoading) return null;

    const message = this.store.messages.length
      ? i18n.t('cantLoadMore')
      : i18n.t('cantLoad');

    return (
      <ErrorLoading
        message={message}
        tryAgain={this.loadMoreForce}
        inverted={true}
      />
    );
  }

  /**
   * Send message
   */
  send = async () => {
    const myGuid = this.props.user.me.guid;
    const msg = this.state.text;

    this.setState({ text: '' });

    try {
      await this.store.send(myGuid, msg);
    } catch (err) {
      logService.exception('[ConversationScreen]', err);
    }

    setTimeout(() => {
      if (this.list && this.list.scrollToOffset) {
        this.list.scrollToOffset({ offset: 0, animated: false });
      }
    }, 100);
  };

  /**
   * render row
   * @param {object} row
   */
  renderMessage = (row) => {
    return (
      <Message
        message={row.item}
        right={row.item.owner.guid === this.props.user.me.guid}
        navigation={this.props.navigation}
      />
    );
  };
}

const d = Dimensions.get('window');

// styles
const styles = StyleSheet.create({
  listView: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 5,
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

    ...(d.height == 812
      ? {
          paddingTop: 4,
          paddingBottom: 24,
        }
      : {}),
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
    width: 25,
  },
  characterCounter: {
    color: '#ccc',
    textAlign: 'right',
    marginRight: 4,
    marginBottom: 4,
  },
});
