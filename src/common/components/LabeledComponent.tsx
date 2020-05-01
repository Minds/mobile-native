import React, { FunctionComponent } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';

type propsType = {
  label: string;
  wrapperStyle?: any;
};

const LabeledComponent: FunctionComponent<propsType> = ({
  children,
  label,
  wrapperStyle,
}) => {
  const theme = ThemedStyles.style;

  return (
    <View style={wrapperStyle}>
      <Text style={[theme.colorSecondaryText, styles.label]}>{label}</Text>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 13,
    marginBottom: 10,
  },
});

export default LabeledComponent;
