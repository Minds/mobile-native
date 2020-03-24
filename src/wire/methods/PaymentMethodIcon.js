import * as React from 'react'

import Icon from 'react-native-vector-icons/FontAwesome5';

type PropsType = {
  value: string
};

/**
 * Payment method selector
 */
export default class PaymentMethodIcon extends React.PureComponent<PropsType> {
  render(): React.Node {
    const { value, ...other } = this.props;
    let icon: string = '';
    switch (value.toLowerCase()) {
      case 'tokens':
        icon = 'lightbulb';
        break;
      case 'usd':
        icon = 'dollar-sign';
        break;
      case 'btc':
        icon = 'bitcoin';
        break;
      case 'eth':
        icon = 'ethereum';
        break;
    }

    return <Icon name={icon} {...other} />
  }
}