import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

type propsType = {
  label: string;
  wrapperStyle?: any;
  labelStyle?: any;
};

const LabeledComponent: FunctionComponent<propsType> = ({
  children,
  label,
  wrapperStyle,
  labelStyle,
}) => {
  const theme = ThemedStyles.style;

  const labelStyles = [theme.colorSecondaryText, styles.label, labelStyle];

  return (
    <View style={wrapperStyle}>
      <Text style={labelStyles}>{label}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
});

export default LabeledComponent;
