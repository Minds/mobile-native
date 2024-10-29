import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';

import MText from '~/common/components/MText';
import { Button } from '~/common/ui';
import { MindsVideoStoreType } from '../createMindsVideoStore';
import sp from '~/services/serviceProvider';

const Error = ({ localStore }: { localStore: MindsVideoStoreType }) => {
  return (
    <View style={[styles.overlayContainer, sp.styles.style.bgBlack]}>
      <MText style={sp.styles.style.colorSecondaryText}>
        {sp.i18n.t('errorMediaDisplay')}
      </MText>
      <Button mode="flat" onPress={() => localStore.play()}>
        {sp.i18n.t('tryAgain')}
      </Button>
    </View>
  );
};

export default Error;
