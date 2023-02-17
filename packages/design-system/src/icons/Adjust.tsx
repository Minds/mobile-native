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
        d="M18.5 13.5V8.5H20.1797V10.1797H23.5V11.8203H20.1797V13.5H18.5ZM23.5 16.8203H15.1797V15.1797H23.5V16.8203ZM11.8203 13.5H13.5V18.5H11.8203V16.8203H8.5V15.1797H11.8203V13.5ZM16.8203 23.5H15.1797V18.5H16.8203V20.1797H23.5V21.8203H16.8203V23.5ZM8.5 10.1797H16.8203V11.8203H8.5V10.1797ZM8.5 20.1797H13.5V21.8203H8.5V20.1797Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Adjust';

export const Adjust = memo<IconProps>(themed(Icon));
