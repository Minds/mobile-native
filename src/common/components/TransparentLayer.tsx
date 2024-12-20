import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = ['rgba(0,0,0,0.20)', 'rgba(0,0,0,0.8)'] as readonly [
  string,
  string,
];

export default function TransparentLayer() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient style={StyleSheet.absoluteFill} colors={colors} />
    </View>
  );
}
