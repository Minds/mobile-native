import React from 'react';
import { View } from 'react-native';
import Card from './Card';
import { DashBoardPropsType } from './TokensTab';

const LiquidityDashboard = ({ metrics }: DashBoardPropsType) => {
  return (
    <View>
      {(Object.keys(metrics) as Array<keyof typeof metrics>).map(key => {
        return <Card metrics={metrics[key]} type={key} />;
      })}
    </View>
  );
};

export default LiquidityDashboard;
