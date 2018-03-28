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
  inject,
  observer
} from 'mobx-react/native'

import { CommonStyle } from '../styles/Common';
import { ComponentsStyle } from '../styles/Components';
import Button from '../common/components/Button';

/**
 * Messenger Invite
 */
@inject('messengerConversation')
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

    btnText = invited ? 'Invited!' : 'Invite'

    const button = <Button onPress={ this.invite } text={btnText}/>

    return (
      <View style={[CommonStyle.flexContainer, CommonStyle.padding2x, CommonStyle.backgroundLight]}>

        <View style={[CommonStyle.paddingBottom3x, CommonStyle.padding3x]}>
          <Text style={[CommonStyle.fontXL, CommonStyle.textCenter]}>Looks like <Text style={CommonStyle.flexContainerCenter}>@{ invitable[0].username }</Text> isn't using Minds Messenger yet.</Text>
        </View>
        <View style={[CommonStyle.centered]}>
          {button}
        </View>
      </View>
    )
  }
}