import React from 'react';
import { styles } from './styles';
import i18n from '../../../../common/services/i18n.service';
import { View } from 'react-native';
import ThemedStyles from '../../../../styles/ThemedStyles';
import MText from '../../../../common/components/MText';
import { Button } from '~/common/ui';
import { MindsVideoStoreType } from '../createMindsVideoStore';

const Error = ({ localStore }: { localStore: MindsVideoStoreType }) => {
  return (
    <View style={styles.overlayContainer}>
      <MText style={ThemedStyles.style.colorSecondaryText}>
        {i18n.t('errorMediaDisplay')}
      </MText>
      <Button mode="flat" onPress={() => localStore.play()}>
        {i18n.t('tryAgain')}
      </Button>
    </View>
  );
};

export default Error;
