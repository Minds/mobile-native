import React from 'react';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const colors = ['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.20)', 'rgba(0,0,0,0.5)'];

export default function TransparentLayer() {
  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.layer} />
      <LinearGradient style={StyleSheet.absoluteFill} colors={colors} />
    </View>
  );
}

const styles = StyleSheet.create({
  layer: {
    backgroundColor: 'rgba(37, 46, 49, 0.8)',
    flex: 1,
  },
});
