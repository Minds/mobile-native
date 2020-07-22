import React from 'react';
import { observer } from 'mobx-react';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';
import { View, Text } from 'react-native';

const Error = observer(() => {
  return (
    <View style={styles.overlayContainer}>
      <Text style={styles.errorText}>{i18n.t('errorMediaDisplay')}</Text>
    </View>
  );
});

export default Error;
