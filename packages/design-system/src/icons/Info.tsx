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
        d="M16.8203 13.5V11.8203H15.1797V13.5H16.8203ZM16.8203 20.1797V15.1797H15.1797V20.1797H16.8203ZM10.1016 10.1406C11.7422 8.5 13.7083 7.67969 16 7.67969C18.2917 7.67969 20.2448 8.5 21.8594 10.1406C23.5 11.7552 24.3203 13.7083 24.3203 16C24.3203 18.2917 23.5 20.2578 21.8594 21.8984C20.2448 23.513 18.2917 24.3203 16 24.3203C13.7083 24.3203 11.7422 23.513 10.1016 21.8984C8.48698 20.2578 7.67969 18.2917 7.67969 16C7.67969 13.7083 8.48698 11.7552 10.1016 10.1406Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Info';

export const Info = memo<IconProps>(withTheme(Icon));
