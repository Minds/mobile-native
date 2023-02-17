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
        d="M19.3203 14.3203V16H16.8203V18.5H15.1797V16H12.6797V14.3203H15.1797V11.8203H16.8203V14.3203H19.3203ZM23.5 20.1797V10.1797H8.5V20.1797H23.5ZM23.5 8.5C23.9688 8.5 24.3594 8.66927 24.6719 9.00781C25.0104 9.32031 25.1797 9.71094 25.1797 10.1797L25.1406 20.1797C25.1406 20.6224 24.9714 21.013 24.6328 21.3516C24.3203 21.6641 23.9427 21.8203 23.5 21.8203H19.3203V23.5H12.6797V21.8203H8.5C8.03125 21.8203 7.6276 21.6641 7.28906 21.3516C6.97656 21.0391 6.82031 20.6484 6.82031 20.1797V10.1797C6.82031 9.71094 6.97656 9.32031 7.28906 9.00781C7.6276 8.66927 8.03125 8.5 8.5 8.5H23.5Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'MindsPlus';

export const MindsPlus = memo<IconProps>(themed(Icon));
