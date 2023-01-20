import React from 'react';
import { View } from 'react-native';
import SupermindBorderView from '~/common/components/supermind/SupermindBorderView';
import { remindContainerStyle } from '~/newsfeed/activity/styles';
import ActivityModel from '../ActivityModel';

export default function ActivityContainer({
  entity,
  children,
}: React.PropsWithChildren<{
  entity: ActivityModel;
}>) {
  const Container: any =
    entity.supermind && entity.supermind.is_reply
      ? SupermindBorderView
      : QuoteContainer;

  return <Container>{children}</Container>;
}

const QuoteContainer = ({ children }) => (
  <View style={remindContainerStyle}>{children}</View>
);
