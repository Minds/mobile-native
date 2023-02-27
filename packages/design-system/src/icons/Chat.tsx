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
        d="M22.6797 7.67969C23.1224 7.67969 23.5 7.84896 23.8125 8.1875C24.151 8.5 24.3203 8.8776 24.3203 9.32031V19.3203C24.3203 19.763 24.151 20.1536 23.8125 20.4922C23.5 20.8307 23.1224 21 22.6797 21H11L7.67969 24.3203V9.32031C7.67969 8.8776 7.83594 8.5 8.14844 8.1875C8.48698 7.84896 8.8776 7.67969 9.32031 7.67969H22.6797Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Chat';

export const Chat = memo<IconProps>(withTheme(Icon));
