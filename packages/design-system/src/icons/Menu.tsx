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
        d="M8.5 11H23.5V12.6797H8.5V11ZM8.5 16.8203V15.1797H23.5V16.8203H8.5ZM8.5 21V19.3203H23.5V21H8.5Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Menu';

export const Menu = memo<IconProps>(withTheme(Icon));
