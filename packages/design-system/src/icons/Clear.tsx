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
        d="M21.8203 11.3516L17.1719 16L21.8203 20.6484L20.6484 21.8203L16 17.1719L11.3516 21.8203L10.1797 20.6484L14.8281 16L10.1797 11.3516L11.3516 10.1797L16 14.8281L20.6484 10.1797L21.8203 11.3516Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Clear';

export const Clear = memo<IconProps>(themed(Icon));
