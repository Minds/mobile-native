import React from 'react';
import { StyleSheet } from 'react-native';
import Row from './Row';
import Spacer from './Spacer';
import ThemedStyles from '~/styles/ThemedStyles';

export const HairlineSpacer = ({ children, bordered = true, ...more }) => {
  return (
    <Spacer style={bordered && styles.border} {...more}>
      {children}
    </Spacer>
  );
};

export const HairlineRow = ({ children, bordered = true, ...more }) => {
  return (
    <Row style={bordered && styles.border} {...more}>
      {children}
    </Row>
  );
};

const styles = StyleSheet.create({
  border: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: ThemedStyles.getColor('PrimaryBorder'),
  },
});

export default HairlineRow;
