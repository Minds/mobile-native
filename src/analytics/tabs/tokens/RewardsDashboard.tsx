import React from 'react';
import { View } from 'react-native';
import ThemedStyles from '../../../styles/ThemedStyles';
import Card from './Card';
import { DashBoardPropsType } from './TokensTab';

const RewardsDashboard = ({ metrics }: DashBoardPropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View style={theme.paddingTop6x}>
      {Object.keys(metrics).map((key: string) => {
        return <Card metrics={metrics[key]} type={key} />;
      })}
    </View>
  );
};

export default RewardsDashboard;
