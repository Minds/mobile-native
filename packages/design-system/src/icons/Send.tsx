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
        d="M7.67969 23.5V17.6797L20.1797 16L7.67969 14.3203V8.5L25.1797 16L7.67969 23.5Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Send';

export const Send = memo<IconProps>(themed(Icon));
