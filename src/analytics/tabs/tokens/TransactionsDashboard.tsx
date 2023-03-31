import React from 'react';
import { View } from 'react-native';
import Card from './Card';
import { DashBoardPropsType } from './TokensTab';

const TransactionsDashboard = ({ metrics }: DashBoardPropsType) => {
  return (
    <View>
      {Object.keys(metrics).map((key: any) => {
        return <Card key={key} metrics={metrics[key]} type={key} />;
      })}
    </View>
  );
};

export default TransactionsDashboard;
