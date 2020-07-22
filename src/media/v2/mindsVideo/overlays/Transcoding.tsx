import React from 'react';
import { observer } from 'mobx-react';
import { View, Text } from 'react-native';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';

const Transcoding = observer(() => {
  return (
    <View style={[styles.overlayContainer, styles.overlayContainerTransparent]}>
      <Text style={styles.errorText}>{i18n.t('transcodingMediaDisplay')}</Text>
    </View>
  );
});

export default Transcoding;
