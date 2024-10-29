import React from 'react';

import MText, { MTextProps } from './MText';
import sp from '~/services/serviceProvider';

type LinkProps = { url?: string; decoration?: boolean } & MTextProps;

export default function Link({ decoration = true, ...props }: LinkProps) {
  return (
    <MText
      {...props}
      onPress={
        props.url ? () => sp.resolve('openURL').open(props.url!) : props.onPress
      }
      style={[
        decoration && { textDecorationLine: 'underline' },
        sp.styles.style.colorLink,
        props.style,
      ]}
    />
  );
}
