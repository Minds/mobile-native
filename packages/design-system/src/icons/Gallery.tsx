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
        d="M13.0703 17.25L10.1797 21H21.8203L18.0703 16L15.1797 19.75L13.0703 17.25ZM23.5 21.8203C23.5 22.263 23.3307 22.6536 22.9922 22.9922C22.6536 23.3307 22.263 23.5 21.8203 23.5H10.1797C9.73698 23.5 9.34635 23.3307 9.00781 22.9922C8.66927 22.6536 8.5 22.263 8.5 21.8203V10.1797C8.5 9.73698 8.66927 9.34635 9.00781 9.00781C9.34635 8.66927 9.73698 8.5 10.1797 8.5H21.8203C22.263 8.5 22.6536 8.66927 22.9922 9.00781C23.3307 9.34635 23.5 9.73698 23.5 10.1797V21.8203Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Gallery';

export const Gallery = memo<IconProps>(themed(Icon));
