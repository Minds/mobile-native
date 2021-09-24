//@ts-nocheck
import React, { PureComponent } from 'react';
import { ColorValue } from 'react-native';
import Icon from '~base/icons/Icon';

interface PropsType {
  color: ColorValue;
  size?: number;
  name: string;
}

export default class TabIcon extends PureComponent<PropsType> {
  render() {
    const { name, color } = this.props;
    return <Icon name={name} size="medium" color={color} />;
  }
}
