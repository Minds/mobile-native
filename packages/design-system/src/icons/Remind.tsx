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
        d="M20.1797 20.1797V16.8203H21.8203V21.8203H11.8203V24.3203L8.5 21L11.8203 17.6797V20.1797H20.1797ZM11.8203 11.8203V15.1797H10.1797V10.1797H20.1797V7.67969L23.5 11L20.1797 14.3203V11.8203H11.8203Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Remind';

export const Remind = memo<IconProps>(themed(Icon));
