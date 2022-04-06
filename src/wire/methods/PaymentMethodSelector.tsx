import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import testID from '../../common/helpers/testID';
import PaymentMethodIcon from './PaymentMethodIcon';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from '../../common/components/MText';

type PropsType = {
  value: string;
  onSelect: Function;
};

/**
 * Payment method selector
 */
export default class PaymentMethodSelector extends React.PureComponent<PropsType> {
  methods = [
    { label: 'Tokens', handle: (): any => this.onSelect('tokens') },
    { label: 'USD', handle: (): any => this.onSelect('usd') },
    { label: 'BTC', handle: (): any => this.onSelect('btc') },
    { label: 'ETH', handle: (): any => this.onSelect('eth') },
  ];

  /**
   * On method selected
   * @param {*} method
   */
  onSelect(method: any) {
    if (this.props.onSelect) {
      this.props.onSelect(method);
    }
  }

  /**
   * Render
   */
  render(): React.ReactNode {
    const theme = ThemedStyles.style;
    return (
      <View style={[theme.rowJustifySpaceEvenly, theme.fullWidth]}>
        {this.methods.map(
          (method: any, i: number): React.ReactNode => (
            <TouchableOpacity
              style={[theme.alignCenter, theme.padding]}
              {...testID(`PAYMENT METHOD ${method.label}`)}
              key={i}
              onPress={method.handle}>
              <PaymentMethodIcon
                value={method.label}
                size={30}
                style={
                  method.label.toLowerCase() === this.props.value
                    ? theme.colorIconActive
                    : theme.colorIcon
                }
              />
              <MText
                style={[
                  theme.fontL,
                  method.label.toLowerCase() === this.props.value
                    ? theme.colorIconActive
                    : theme.colorIcon,
                ]}>
                {method.label.toUpperCase()}
              </MText>
            </TouchableOpacity>
          ),
        )}
      </View>
    );
  }
}
