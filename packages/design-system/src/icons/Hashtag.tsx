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
        d="M11.8828 23L14.5 8.78125H16.1016L13.4844 23H11.8828ZM15.6914 23L18.3086 8.78125H19.9102L17.293 23H15.6914ZM21.2383 14.3574H11.082V12.8438H21.2383V14.3574ZM20.5059 18.9961H10.3398V17.4824H20.5059V18.9961Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Hashtag';

export const Hashtag = memo<IconProps>(themed(Icon));
