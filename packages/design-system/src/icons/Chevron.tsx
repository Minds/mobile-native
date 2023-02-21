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
        d="M18.8516 12.1719L15.0234 16L18.8516 19.8281L17.6797 21L12.6797 16L17.6797 11L18.8516 12.1719Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Chevron';

export const Chevron = memo<IconProps>(withTheme(Icon));
