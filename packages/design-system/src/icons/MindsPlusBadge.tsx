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
        d="M11.2734 20.7266C12.6016 22.0286 14.1771 22.6797 16 22.6797C17.8229 22.6797 19.3854 22.0286 20.6875 20.7266C22.0156 19.3984 22.6797 17.8229 22.6797 16C22.6797 14.1771 22.0156 12.6146 20.6875 11.3125C19.3854 9.98438 17.8229 9.32031 16 9.32031C14.1771 9.32031 12.6016 9.98438 11.2734 11.3125C9.97135 12.6146 9.32031 14.1771 9.32031 16C9.32031 17.8229 9.97135 19.3984 11.2734 20.7266ZM10.1016 10.1406C11.7422 8.5 13.7083 7.67969 16 7.67969C18.2917 7.67969 20.2448 8.5 21.8594 10.1406C23.5 11.7552 24.3203 13.7083 24.3203 16C24.3203 18.2917 23.5 20.2578 21.8594 21.8984C20.2448 23.513 18.2917 24.3203 16 24.3203C13.7083 24.3203 11.7422 23.513 10.1016 21.8984C8.48698 20.2578 7.67969 18.2917 7.67969 16C7.67969 13.7083 8.48698 11.7552 10.1016 10.1406ZM16.8203 11.8203V15.1797H20.1797V16.8203H16.8203V20.1797H15.1797V16.8203H11.8203V15.1797H15.1797V11.8203H16.8203Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'MindsPlusBadge';

export const MindsPlusBadge = memo<IconProps>(themed(Icon));
