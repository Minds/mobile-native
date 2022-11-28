import React from 'react';
import ThemedStyles from '../../styles/ThemedStyles';
import openUrlService from '../services/open-url.service';
import MText, { MTextProps } from './MText';

type LinkProps = { url?: string } & MTextProps;

export default function Link(props: LinkProps) {
  return (
    <MText
      {...props}
      onPress={
        props.url ? () => openUrlService.open(props.url!) : props.onPress
      }
      style={[
        { textDecorationLine: 'underline' },
        ThemedStyles.style.colorLink,
        props.style,
      ]}
    />
  );
}
