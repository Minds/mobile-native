import React from 'react';
import { View } from 'react-native';
import Card from './Card';
import { DashBoardPropsType } from './TokensTab';

const SupplyDashboard = ({ metrics }: DashBoardPropsType) => {
  return (
    <View>
      {Object.keys(metrics).map((key: string) => {
        return <Card metrics={metrics[key]} type={key} />;
      })}
    </View>
  );
};

export default SupplyDashboard;
