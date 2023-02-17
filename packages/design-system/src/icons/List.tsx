/* eslint-disable react/react-in-jsx-scope */
import { memo } from 'react';
import { IconProps } from '../IconProps';
import { Svg, Path } from 'react-native-svg';
import { themed } from '../config/themed';

const Icon = (props: IconProps) => {
  const { color = 'black', size = 32, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill={`${color}`}
      {...otherProps}>
      <Path
        d="M11.8203 11.8203H23.5V13.5H11.8203V11.8203ZM11.8203 20.1797V18.5H23.5V20.1797H11.8203ZM11.8203 16.8203V15.1797H23.5V16.8203H11.8203ZM8.5 13.5V11.8203H10.1797V13.5H8.5ZM8.5 20.1797V18.5H10.1797V20.1797H8.5ZM8.5 16.8203V15.1797H10.1797V16.8203H8.5Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'List';

export const List = memo<IconProps>(themed(Icon));
