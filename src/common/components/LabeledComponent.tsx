import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

type propsType = {
  label: string;
  wrapperStyle?: any;
  labelStyle?: any;
  valueStyle?: any;
};

const LabeledComponent: FunctionComponent<propsType> = ({
  children,
  label,
  wrapperStyle,
  labelStyle,
  valueStyle,
}) => {
  const theme = ThemedStyles.style;

  const labelStyles = [theme.colorSecondaryText, styles.label, labelStyle];
  const valueStyles = [theme.colorPrimaryText, styles.value, valueStyle];
  const wrapperStyles = [styles.wrapper, wrapperStyle];

  return (
    <View style={wrapperStyles}>
      <Text style={labelStyles}>{label}</Text>
      <Text style={valueStyles}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  value: {
    marginTop: 4,
    marginBottom: 4,
    fontSize: 16,
  },
  wrapper: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default LabeledComponent;
