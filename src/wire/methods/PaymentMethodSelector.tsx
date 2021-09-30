import React from 'react';

import { View, TouchableOpacity } from 'react-native';

import featuresService from '../../common/services/features.service';
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
  methods: Array<any>;

  /**
   * @param {PropsType} props
   */
  constructor(props: PropsType) {
    super(props);

    if (featuresService.has('wire-multi-currency')) {
      this.methods = [
        { label: 'Tokens', handle: (): any => this.onSelect('tokens') },
        { label: 'USD', handle: (): any => this.onSelect('usd') },
        { label: 'BTC', handle: (): any => this.onSelect('btc') },
        { label: 'ETH', handle: (): any => this.onSelect('eth') },
      ];
    } else {
      this.methods = [
        { label: 'Tokens', handle: (): any => this.onSelect('tokens') },
      ];
    }
  }

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
              onPress={method.handle}
            >
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
                ]}
              >
                {method.label.toUpperCase()}
              </MText>
            </TouchableOpacity>
          ),
        )}
      </View>
    );
  }
}
