import React from 'react';
import { View, Text } from 'react-native';

type WidgetWrapProps = {
  children: React.ReactChildren | React.ReactNode | React.ReactNode[];
  title?: string;
};

export function WidgetWrapper({
  children,
  title,
}: WidgetWrapProps): JSX.Element {
  return (
    <>
      <Text>{title}</Text>
      <View>{children}</View>
    </>
  );
}
