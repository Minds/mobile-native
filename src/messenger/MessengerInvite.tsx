//@ts-nocheck
import React, { Component } from 'react';
import { Text, View } from 'react-native';
import { observer } from 'mobx-react';

import Button from '../common/components/Button';
import i18n from '../common/services/i18n.service';
import ThemedStyles from '../styles/ThemedStyles';

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
  };

  /**
   * Render
   */
  render() {
    const invitable = this.props.messengerConversation.invitable;
    const invited = this.props.messengerConversation.invited;
    const theme = ThemedStyles.style;

    const btnText = invited
      ? i18n.t('messenger.invited')
      : i18n.t('messenger.invite');

    const button = <Button onPress={this.invite} text={btnText} />;

    return (
      <View
        style={[theme.flexContainer, theme.padding2x, theme.backgroundLight]}>
        <View style={[theme.paddingBottom3x, theme.padding3x]}>
          <MText style={[theme.fontXL, theme.textCenter]}>
            {i18n.t('messenger.looksLike')}{' '}
            <MText style={theme.flexContainerCenter}>
              @{invitable[0].username}
            </MText>{' '}
            {i18n.t('messenger.isntUsingMessenger')}.
          </MText>
        </View>
        <View style={[theme.centered]}>{button}</View>
      </View>
    );
  }
}
