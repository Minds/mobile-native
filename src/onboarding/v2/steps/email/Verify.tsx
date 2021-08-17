import React from 'react';
import { View, Text } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../../common/services/i18n.service';

type PropsType = {};

const Verify = ({}: PropsType) => {
  return (
    <>
      <Text style={[ThemedStyles.style.fontL, ThemedStyles.style.textCenter]}>
        {i18n.t('errorMessage') + '\n'}
        <Text>{i18n.t('tryAgain')}</Text>
      </Text>
    </>
  );
};

export default Verify;
