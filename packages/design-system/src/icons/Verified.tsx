/* eslint-disable react/react-in-jsx-scope */
import { memo } from 'react';
import { IconProps } from '../IconProps';
import { Svg, Path } from 'react-native-svg';
import { withTheme } from '../config/withTheme';

const Icon = (props: IconProps) => {
  const { color = 'black', size = 24, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={`${color}`}
      {...otherProps}>
      <Path
        d="M7.6 21.5L5.7 18.3L2.1 17.5L2.45 13.8L0 11L2.45 8.2L2.1 4.5L5.7 3.7L7.6 0.5L11 1.95L14.4 0.5L16.3 3.7L19.9 4.5L19.55 8.2L22 11L19.55 13.8L19.9 17.5L16.3 18.3L14.4 21.5L11 20.05L7.6 21.5ZM8.45 18.95L11 17.85L13.6 18.95L15 16.55L17.75 15.9L17.5 13.1L19.35 11L17.5 8.85L17.75 6.05L15 5.45L13.55 3.05L11 4.15L8.4 3.05L7 5.45L4.25 6.05L4.5 8.85L2.65 11L4.5 13.1L4.25 15.95L7 16.55L8.45 18.95ZM9.95 14.55L15.6 8.9L14.2 7.45L9.95 11.7L7.8 9.6L6.4 11L9.95 14.55Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Verified';

export const Verified = memo<IconProps>(withTheme(Icon));
