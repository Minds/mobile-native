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
        d="M21.8203 8.5H25.1797V18.5H21.8203V8.5ZM18.5 8.5C18.9427 8.5 19.3333 8.66927 19.6719 9.00781C20.0104 9.34635 20.1797 9.73698 20.1797 10.1797V18.5C20.1797 18.9427 20.0104 19.3333 19.6719 19.6719L14.2031 25.1797L13.3047 24.2812C13.0703 24.0469 12.9531 23.7604 12.9531 23.4219V23.1484L13.7734 19.3203H8.5C8.05729 19.3203 7.66667 19.1641 7.32812 18.8516C6.98958 18.513 6.82031 18.1224 6.82031 17.6797V16C6.82031 15.7917 6.85938 15.5833 6.9375 15.375L9.47656 9.51562C9.73698 8.83854 10.2448 8.5 11 8.5H18.5Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Downvote';

export const Downvote = memo<IconProps>(withTheme(Icon));
