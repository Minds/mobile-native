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
        d="M19.3203 16.8203C20.0495 16.8203 20.8438 16.9245 21.7031 17.1328C22.5625 17.3411 23.3568 17.6797 24.0859 18.1484C24.8151 18.6172 25.1797 19.151 25.1797 19.75V21.8203H20.1797V19.75C20.1797 18.6042 19.6328 17.6406 18.5391 16.8594C18.7214 16.8333 18.9818 16.8203 19.3203 16.8203ZM10.2969 17.1328C11.1562 16.9245 11.9505 16.8203 12.6797 16.8203C13.4089 16.8203 14.2031 16.9245 15.0625 17.1328C15.9219 17.3411 16.7031 17.6797 17.4062 18.1484C18.1354 18.6172 18.5 19.151 18.5 19.75V21.8203H6.82031V19.75C6.82031 19.151 7.1849 18.6172 7.91406 18.1484C8.64323 17.6797 9.4375 17.3411 10.2969 17.1328ZM14.3984 14.4375C13.9297 14.9323 13.3568 15.1797 12.6797 15.1797C12.0026 15.1797 11.4167 14.9323 10.9219 14.4375C10.4271 13.9427 10.1797 13.3568 10.1797 12.6797C10.1797 12.0026 10.4271 11.4167 10.9219 10.9219C11.4167 10.4271 12.0026 10.1797 12.6797 10.1797C13.3568 10.1797 13.9297 10.4271 14.3984 10.9219C14.8932 11.4167 15.1406 12.0026 15.1406 12.6797C15.1406 13.3568 14.8932 13.9427 14.3984 14.4375ZM21.0781 14.4375C20.5833 14.9323 19.9974 15.1797 19.3203 15.1797C18.6432 15.1797 18.0573 14.9323 17.5625 14.4375C17.0677 13.9427 16.8203 13.3568 16.8203 12.6797C16.8203 12.0026 17.0677 11.4167 17.5625 10.9219C18.0573 10.4271 18.6432 10.1797 19.3203 10.1797C19.9974 10.1797 20.5833 10.4271 21.0781 10.9219C21.5729 11.4167 21.8203 12.0026 21.8203 12.6797C21.8203 13.3568 21.5729 13.9427 21.0781 14.4375Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Group';

export const Group = memo<IconProps>(withTheme(Icon));