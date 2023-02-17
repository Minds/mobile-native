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
        d="M19.3203 11H24.3203V16L22.4062 14.0859L17.1719 19.3203L13.8516 16L8.85156 21L7.67969 19.8281L13.8516 13.6562L17.1719 16.9766L21.2344 12.9141L19.3203 11Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Boost';

export const Boost = memo<IconProps>(themed(Icon));
