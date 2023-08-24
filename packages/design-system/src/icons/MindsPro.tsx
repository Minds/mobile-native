/* eslint-disable react/react-in-jsx-scope */
import { memo } from 'react';
import { IconProps } from '../IconProps';
import { Svg, Path, G, Defs, ClipPath, Rect } from 'react-native-svg';
import { withTheme } from '../config/withTheme';

const Icon = (props: IconProps) => {
  const { color = 'black', size = 32, ...otherProps } = props;
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 23 23"
      fill={`${color}`}
      {...otherProps}>
      <G clipPath="url(#clip0_1349_21774)" fill={`${color}`}>
        <Path
          d="M21 3H3C1.9 3 1 3.9 1 5V17C1 18.1 1.9 19 3 19H8V21H16V19H21C22.1 19 22.99 18.1 22.99 17L23 5C23 3.9 22.1 3 21 3ZM21 17H3V5H21V17Z"
          fill={`${color}`}
        />
        <G clipPath="url(#clip1_1349_21774)" fill={`${color}`}>
          <Path
            d="M11.0999 14.5996H12.6999C12.6999 15.0396 12.3399 15.3996 11.8999 15.3996C11.4599 15.3996 11.0999 15.0396 11.0999 14.5996ZM10.2999 14.1996H13.4999V13.3996H10.2999V14.1996ZM14.8999 10.3996C14.8999 11.9276 13.8359 12.7436 13.3919 12.9996H10.4079C9.9639 12.7436 8.8999 11.9276 8.8999 10.3996C8.8999 8.74361 10.2439 7.39961 11.8999 7.39961C13.5559 7.39961 14.8999 8.74361 14.8999 10.3996ZM14.0999 10.3996C14.0999 9.18761 13.1119 8.19961 11.8999 8.19961C10.6879 8.19961 9.6999 9.18761 9.6999 10.3996C9.6999 11.3876 10.2959 11.9556 10.6399 12.1996H13.1599C13.5039 11.9556 14.0999 11.3876 14.0999 10.3996ZM16.8479 9.54761L16.2999 9.79961L16.8479 10.0516L17.0999 10.5996L17.3519 10.0516L17.8999 9.79961L17.3519 9.54761L17.0999 8.99961L16.8479 9.54761ZM15.8999 8.99961L16.2759 8.17561L17.0999 7.79961L16.2759 7.42361L15.8999 6.59961L15.5239 7.42361L14.6999 7.79961L15.5239 8.17561L15.8999 8.99961Z"
            fill={`${color}`}
          />
        </G>
      </G>
      <Defs>
        <ClipPath id="clip0_1349_21774">
          <Rect width="24" height="24" fill={`${color}`} />
        </ClipPath>
        <ClipPath id="clip1_1349_21774">
          <Rect
            width="9.6"
            height="9.6"
            fill={`${color}`}
            transform="translate(8.29993 6.59961)"
          />
        </ClipPath>
      </Defs>
    </Svg>
  );
};

Icon.displayName = 'MindsPro';

export const MindsPro = memo<IconProps>(withTheme(Icon));
