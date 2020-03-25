import * as React from 'react'
import { View, Text, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import { CommonStyle as CS } from '../../styles/Common';
import viewportPercentage from '../../common/helpers/viewportPercentage';
import Button from '../../common/components/Button';
import i18nService from '../../common/services/i18n.service';

type PropsType = {
  address: string,
  amount: number,
  onCancel?: Function
};

/**
 * Btc Payment
 */
export default class BtcPayment extends React.PureComponent<PropsType> {
  url = '';

  /**
   * Open bitcoin link
   */
  openLink = () => {
    Linking.openURL(this.url);
  }

  cancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  /**
   * Render
   */
  render(): React.Node {

    this.url = `bitcoin:${this.props.address}?amount=${this.props.amount}`;

    return (
      <View style={[CS.flexContainer, CS.marginTop3x]}>
        <Text style={[CS.fontXL, CS.textCenter]}>Tap to send <Text style={CS.colorPrimary}>{ this.props.amount } BTC</Text> to</Text>
        <Text style={[CS.colorPrimary, CS.fontL]} numberOfLines={1}>{ this.props.address }</Text>
        <View style={CS.rowJustifyCenter}>
          <Button
            text={i18nService.t('goback')}
            onPress={this.cancel}
            containerStyle={CS.padding}
            textStyle={CS.fontL}
          />
          <Button
            inverted
            text={i18nService.t('send').toUpperCase()}
            onPress={this.openLink}
            containerStyle={CS.padding}
            textStyle={CS.fontL}
          />
        </View>

        <Text style={[CS.fontXL, CS.textCenter, CS.marginTop4x]}>Or scan the following QR code</Text>
        <View style={[CS.centered, CS.marginTop3x]}>
          <QRCode
            value={this.url}
            size={viewportPercentage(70).value}
          />
        </View>
      </View>
    );
  }

}