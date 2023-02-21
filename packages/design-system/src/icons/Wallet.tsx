/* eslint-disable react/react-in-jsx-scope */
import { memo } from 'react';
import { IconProps } from '../IconProps';
import { Svg, Path } from 'react-native-svg';
import { withTheme } from '../config/withTheme';

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
        d="M15.5703 6.82031L23.5 11V12.6797H7.67969V11L15.5703 6.82031ZM19.3203 14.3203H21.8203V20.1797H19.3203V14.3203ZM7.67969 24.3203V21.8203H23.5V24.3203H7.67969ZM14.3203 14.3203H16.8203V20.1797H14.3203V14.3203ZM9.32031 14.3203H11.8203V20.1797H9.32031V14.3203Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Wallet';

export const Wallet = memo<IconProps>(withTheme(Icon));
