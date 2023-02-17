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
        d="M21 19.3203L22.6797 21V21.8203H9.32031V21L11 19.3203V15.1797C11 13.8776 11.3255 12.7448 11.9766 11.7812C12.6536 10.8177 13.5781 10.1927 14.75 9.90625V9.32031C14.75 8.98177 14.8672 8.69531 15.1016 8.46094C15.3359 8.20052 15.6354 8.07031 16 8.07031C16.3646 8.07031 16.6641 8.20052 16.8984 8.46094C17.1328 8.69531 17.25 8.98177 17.25 9.32031V9.90625C18.4219 10.1927 19.3333 10.8177 19.9844 11.7812C20.6615 12.7448 21 13.8776 21 15.1797V19.3203ZM16 24.3203C15.5312 24.3203 15.1276 24.1641 14.7891 23.8516C14.4766 23.5391 14.3203 23.1484 14.3203 22.6797H17.6797C17.6797 23.1224 17.5104 23.513 17.1719 23.8516C16.8333 24.1641 16.4427 24.3203 16 24.3203Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Notifications';

export const Notifications = memo<IconProps>(themed(Icon));
