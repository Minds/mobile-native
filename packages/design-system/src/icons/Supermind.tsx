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
        d="M24.3778 14.7333L23.8667 13.6222L22.7556 13.1111L23.8667 12.6L24.3778 11.4889L24.8889 12.6L26 13.1111L24.8889 13.6222L24.3778 14.7333ZM21.5556 10.8444L20.7778 9.2L19.1333 8.42222L20.7778 7.64444L21.5556 6L22.3333 7.64444L23.9778 8.42222L22.3333 9.2L21.5556 10.8444ZM12.6667 25.5556C12.163 25.5556 11.737 25.3815 11.3889 25.0333C11.0407 24.6852 10.8667 24.2593 10.8667 23.7556H14.4667C14.4667 24.2593 14.2926 24.6852 13.9444 25.0333C13.5963 25.3815 13.1704 25.5556 12.6667 25.5556ZM9.06667 22.3778V21.0444H16.2667V22.3778H9.06667ZM9.17778 19.6889C8.2 19.0519 7.42593 18.2556 6.85556 17.3C6.28519 16.3444 6 15.2667 6 14.0667C6 12.2593 6.65926 10.6963 7.97778 9.37778C9.2963 8.05926 10.8593 7.4 12.6667 7.4C14.4741 7.4 16.037 8.05926 17.3556 9.37778C18.6741 10.6963 19.3333 12.2593 19.3333 14.0667C19.3333 15.2667 19.0519 16.3444 18.4889 17.3C17.9259 18.2556 17.1481 19.0519 16.1556 19.6889H9.17778Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Supermind';

export const Supermind = memo<IconProps>(withTheme(Icon));
