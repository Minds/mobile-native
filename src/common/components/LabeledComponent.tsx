import React, { FC, PropsWithChildren } from 'react';
import { View, StyleSheet } from 'react-native';
import ThemedStyles from '../../styles/ThemedStyles';
import MText from './MText';

type propsType = {
  label: string;
  wrapperStyle?: any;
  labelStyle?: any;
  valueStyle?: any;
};

const LabeledComponent: FC<PropsWithChildren<propsType>> = ({
  children,
  label,
  wrapperStyle,
  labelStyle,
}) => {
  const theme = ThemedStyles.style;

  const labelStyles = [theme.colorSecondaryText, styles.label, labelStyle];
  const wrapperStyles = [styles.wrapper, wrapperStyle];

  return (
    <View style={wrapperStyles}>
      <MText style={labelStyles}>{label}</MText>
      {children}
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
