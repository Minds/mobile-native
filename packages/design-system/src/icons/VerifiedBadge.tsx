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
        d="M14.3203 20.1797L21 13.5L19.8281 12.3281L14.3203 17.7969L12.1719 15.6484L11 16.8203L14.3203 20.1797ZM16 6.82031L23.5 10.1797V15.1797C23.5 17.4974 22.7839 19.6198 21.3516 21.5469C19.9193 23.4479 18.1354 24.6589 16 25.1797C13.8646 24.6589 12.0807 23.4479 10.6484 21.5469C9.21615 19.6198 8.5 17.4974 8.5 15.1797V10.1797L16 6.82031Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'VerifiedBadge';

export const VerifiedBadge = memo<IconProps>(withTheme(Icon));
