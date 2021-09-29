import * as React from 'react';
import { View, Text, Linking } from 'react-native';
import QRCode from 'react-native-qrcode-svg';

import viewportPercentage from '../../common/helpers/viewportPercentage';
import Button from '../../common/components/Button';
import i18nService from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';

type PropsType = {
  address: string;
  amount: number;
  onCancel?: Function;
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
  };

  cancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  };

  /**
   * Render
   */
  render(): React.ReactNode {
    this.url = `bitcoin:${this.props.address}?amount=${this.props.amount}`;
    const theme = ThemedStyles.style;
    return (
      <View style={[theme.flexContainer, theme.marginTop3x]}>
        <MText style={[theme.fontXL, theme.textCenter]}>
          Tap to send{' '}
          <MText style={theme.colorLink}>{this.props.amount} BTC</MText> to
        </MText>
        <MText style={[theme.colorLink, theme.fontL]} numberOfLines={1}>
          {this.props.address}
        </MText>
        <View style={theme.rowJustifyCenter}>
          <Button
            text={i18nService.t('goback')}
            onPress={this.cancel}
            containerStyle={theme.padding}
            textStyle={theme.fontL}
          />
          <Button
            inverted
            text={i18nService.t('send').toUpperCase()}
            onPress={this.openLink}
            containerStyle={theme.padding}
            textStyle={theme.fontL}
          />
        </View>

        <MText style={[theme.fontXL, theme.textCenter, theme.marginTop4x]}>
          Or scan the following QR code
        </MText>
        <View style={[theme.centered, theme.marginTop3x]}>
          <QRCode value={this.url} size={viewportPercentage(70).value} />
        </View>
      </View>
    );
  }
}
