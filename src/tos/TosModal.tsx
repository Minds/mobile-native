//@ts-nocheck
import React, { PureComponent } from 'react';
import { View, Linking } from 'react-native';

import Modal from 'react-native-modal';

import Button from '../common/components/Button';
import i18nService from '../common/services/i18n.service';
import { observer } from 'mobx-react';
import mindsConfigService from '../common/services/minds-config.service';
import logService from '../common/services/log.service';
import apiService from '../common/services/api.service';
import ThemedStyles from '../styles/ThemedStyles';
import MText from '../common/components/MText';

/**
 * Tos Modal
 */
@observer
export default class TosModal extends PureComponent {
  state = {
    show: true,
    error: false,
    last_accepted_tos: null,
  };

  /**
   * Component did mount
   */
  componentDidMount() {
    try {
      const settings = mindsConfigService.getSettings();
      if (settings.last_accepted_tos) {
        this.setState({ last_accepted_tos: settings.last_accepted_tos });
      }
    } catch (err) {
      logService.exception('[TosModal]', err);
    }
  }

  /**
   * Show selection
   */
  ok = async () => {
    this.setState({ error: false });
    try {
      const response = await apiService.post('api/v2/settings/tos');
      this.props.user.setTosLastUpdate(response.timestamp);
      this.setState({ show: false });
    } catch (err) {
      this.setState({ error: true });
      logService.exception('[TosModal]', err);
    }
  };

  openTerms = () => {
    Linking.openURL('https://www.minds.com/p/terms');
  };

  openContent = () => {
    Linking.openURL('https://www.minds.com/content-policy');
  };

  /**
   * Render
   */
  render() {
    const theme = ThemedStyles.style;
    if (!this.props.user.me.last_accepted_tos || !this.state.last_accepted_tos)
      return null;

    if (this.props.user.me.last_accepted_tos >= this.state.last_accepted_tos)
      return null;

    return (
      <Modal isVisible={this.state.show}>
        <View style={[theme.bgWhite, { height: 400, paddingBottom: 8 }]}>
          <MText
            style={[
              theme.fontL,
              theme.textCenter,
              theme.bgPrimaryBackground,
              theme.padding2x,
              theme.colorWhite,
            ]}
          >
            UPDATE
          </MText>
          <View style={[theme.flexContainer, theme.padding]}>
            <MText style={[theme.fontS, theme.textJustify]}>
              We've recently updated our{' '}
              <MText onPress={this.openTerms} style={theme.colorPrimary}>
                Terms of Service
              </MText>{' '}
              to reflect the changes to our network with the launch of the Jury
              System. These changes are being implemented to ensure a balance of
              power between Minds, Inc. and the community. The following is a
              brief summary of what has changed:{' '}
            </MText>
            <MText style={[theme.fontS, theme.paddingLeft, theme.paddingTop2x]}>
              · Creation of a separate{' '}
              <MText onPress={this.openContent} style={theme.colorPrimary}>
                Content Policy
              </MText>{' '}
              document for more clarity
            </MText>
            <MText style={[theme.fontS, theme.paddingLeft]}>
              · Clarification of licensing specifications and restrictions
            </MText>
            <MText style={[theme.fontS, theme.paddingLeft]}>
              · Clarification of terminology and overall grammatical
              improvements
            </MText>
            <MText style={[theme.fontS, theme.paddingTop2x, theme.textJustify]}>
              Please also note that your continued use of Minds serves as
              acceptance of these new terms and policies. Thank you.
            </MText>
            {this.state.error && (
              <MText
                style={[
                  theme.fontS,
                  theme.paddingTop2x,
                  theme.textCenter,
                  theme.colorDanger,
                ]}
              >
                There was an error please try again.
              </MText>
            )}
            <View style={[theme.rowJustifyCenter, theme.paddingTop2x]}>
              <Button text={i18nService.t('ok')} onPress={this.ok} />
            </View>
          </View>
        </View>
      </Modal>
    );
  }
}
