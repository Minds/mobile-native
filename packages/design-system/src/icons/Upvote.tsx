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
        d="M25.1797 14.3203V16C25.1797 16.2083 25.1406 16.4167 25.0625 16.625L22.5234 22.4844C22.263 23.1615 21.7552 23.5 21 23.5H13.5C13.0573 23.5 12.6667 23.3307 12.3281 22.9922C11.9896 22.6536 11.8203 22.263 11.8203 21.8203V13.5C11.8203 13.0573 11.9896 12.6667 12.3281 12.3281L17.7969 6.82031L18.6953 7.71875C18.9297 7.95312 19.0469 8.23958 19.0469 8.57812V8.85156L18.2266 12.6797H23.5C23.9427 12.6797 24.3333 12.849 24.6719 13.1875C25.0104 13.5 25.1797 13.8776 25.1797 14.3203ZM6.82031 23.5V13.5H10.1797V23.5H6.82031Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Upvote';

export const Upvote = memo<IconProps>(withTheme(Icon));
