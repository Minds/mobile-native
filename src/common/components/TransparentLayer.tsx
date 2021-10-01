import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = ['rgba(0,0,0,0.80)', 'rgba(0,0,0,0.2)'];

export default function TransparentLayer() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <LinearGradient style={StyleSheet.absoluteFill} colors={colors} />
    </View>
  );
}
