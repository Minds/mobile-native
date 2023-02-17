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
        d="M8.96875 21.4688L10.4531 19.9453L11.625 21.1172L10.1406 22.6406L8.96875 21.4688ZM15.1797 24.7109V22.25H16.8203V24.7109H15.1797ZM12.4453 12.0547C13.4349 11.0651 14.6198 10.5703 16 10.5703C17.3802 10.5703 18.5521 11.0651 19.5156 12.0547C20.5052 13.0182 21 14.1901 21 15.5703C21 16.9505 20.5052 18.1354 19.5156 19.125C18.5521 20.0885 17.3802 20.5703 16 20.5703C14.6198 20.5703 13.4349 20.0885 12.4453 19.125C11.4818 18.1354 11 16.9505 11 15.5703C11 14.1901 11.4818 13.0182 12.4453 12.0547ZM22.6797 14.75H25.1797V16.4297H22.6797V14.75ZM20.375 21.1172L21.5469 19.9844L23.0312 21.4688L21.8594 22.6406L20.375 21.1172ZM23.0312 9.71094L21.5469 11.1953L20.375 10.0234L21.8594 8.53906L23.0312 9.71094ZM16.8203 6.46875V8.92969H15.1797V6.46875H16.8203ZM9.32031 14.75V16.4297H6.82031V14.75H9.32031ZM11.625 10.0234L10.4531 11.1953L8.96875 9.71094L10.1406 8.53906L11.625 10.0234Z"
        fill={`${color}`}
      />
    </Svg>
  );
};

Icon.displayName = 'Lightmode';

export const Lightmode = memo<IconProps>(themed(Icon));
