//@ts-nocheck
import React, {
  Component
} from 'react';

import {
  Text,
  View,
  TextInput,
  StyleSheet,
} from 'react-native';

import {
  observer
} from 'mobx-react'

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Button from '../common/components/Button';
import i18n from '../common/services/i18n.service';

/**
 * Messenger Invite
 */
@observer
export default class MessengerInvite extends Component {

  invite = () => {
    const invited = this.props.messengerConversation.invited;
    if (invited) {
      this.props.navigation.goBack();
    } else {
      this.props.messengerConversation.invite();
    }
  }

  /**
   * Render
   */
  render() {
    const invitable = this.props.messengerConversation.invitable;
    const invited = this.props.messengerConversation.invited;

    btnText = invited ? i18n.t('messenger.invited') : i18n.t('messenger.invite');

    const button = <Button onPress={ this.invite } text={btnText}/>

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x, CommonStyle.backgroundLight]}>

        <View style={[CommonStyle.paddingBottom3x, CommonStyle.padding3x]}>
          <Text style={[CommonStyle.fontXL, CommonStyle.textCenter]}>{i18n.t('messenger.looksLike')} <Text style={CommonStyle.flexContainerCenter}>@{ invitable[0].username }</Text> {i18n.t('messenger.isntUsingMessenger')}.</Text>
        </View>
        <View style={[CommonStyle.centered]}>
          {button}
        </View>
      </View>
    )
  }
}