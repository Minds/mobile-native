import React, { PureComponent } from 'react';
import {
  View,
  Text,
  Linking
} from 'react-native';

import Modal from 'react-native-modal';

import { CommonStyle as CS } from '../styles/Common';
import colors from '../styles/Colors';
import Button from '../common/components/Button';
import i18nService from '../common/services/i18n.service';
import { inject, observer } from 'mobx-react';
import mindsService from '../common/services/minds.service';
import logService from '../common/services/log.service';
import apiService from '../common/services/api.service';

/**
 * Tos Modal
 */
@observer
export default class TosModal extends PureComponent {

  state = {
    show: true,
    error: false,
    last_accepted_tos: null
  }

  /**
   * Component did mount
   */
  async componentDidMount() {
    try {
      const settings = await mindsService.getSettings();
      if (settings.last_accepted_tos) {
        this.setState({last_accepted_tos: settings.last_accepted_tos});
      }
    } catch (err) {
      logService.exception('[TosModal]', err);
    }
  }

  /**
   * Show selection
   */
  ok = async() => {
    this.setState({error: false});
    try {
      const response = await apiService.post('api/v2/settings/tos');
      this.props.user.setTosLastUpdate(response.timestamp);
      this.setState({show: false});
    } catch(err) {
      this.setState({error: true})
      logService.exception('[TosModal]', err);
    }
  }

  openTerms = () => {
    Linking.openURL('https://www.minds.com/p/terms');
  }

  openContent = () => {
    Linking.openURL('https://www.minds.com/content-policy');
  }

  /**
   * Render
   */
  render() {

    if (!this.props.user.me.last_accepted_tos || !this.state.last_accepted_tos) return null;

    if (this.props.user.me.last_accepted_tos >= this.state.last_accepted_tos) return null;

    return (
      <Modal isVisible={this.state.show}>
        <View style={[CS.backgroundWhite, {height: 400, paddingBottom: 8 }]}>
          <Text style={[CS.fontL, CS.textCenter, CS.backgroundPrimary, CS.padding2x, CS.colorWhite]}>UPDATE</Text>
          <View style={[CS.flexContainer, CS.padding]}>
            <Text style={[CS.fontS, CS.textJustify]}>We've recently updated our <Text onPress={this.openTerms} style={CS.colorPrimary}>Terms of Service</Text> to reflect the changes to our network with the launch of the Jury System. These changes are being implemented to ensure a balance of power between Minds, Inc. and the community. The following is a brief summary of what has changed: </Text>
            <Text style={[CS.fontS, CS.paddingLeft, CS.paddingTop2x]}>· Creation of a separate <Text onPress={this.openContent} style={CS.colorPrimary}>Content Policy</Text> document for more clarity</Text>
            <Text style={[CS.fontS, CS.paddingLeft]}>· Clarification of licensing specifications and restrictions</Text>
            <Text style={[CS.fontS, CS.paddingLeft]}>· Clarification of terminology and overall grammatical improvements</Text>
            <Text style={[CS.fontS, CS.paddingTop2x, CS.textJustify]}>Please also note that your continued use of Minds serves as acceptance of these new terms and policies. Thank you.</Text>
            {this.state.error && <Text style={[CS.fontS, CS.paddingTop2x, CS.textCenter, CS.colorDanger]}>There was an error please try again.</Text>}
            <View style={[CS.rowJustifyCenter, CS.paddingTop2x]}>
              <Button text={i18nService.t('ok')} onPress={this.ok}/>
            </View>
          </View>
        </View>
      </Modal>
    )
  }
}