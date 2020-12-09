import { useLocalStore } from 'mobx-react';
import React from 'react';
import { Platform, View } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostHeader from './BoostHeader';
import BoostInput from './BoostInput';
import createBoostStore from './createBoostStore';

const isIos = Platform.OS === 'ios';

const BoostChannelScreen = () => {
  const theme = ThemedStyles.style;
  const localStore = useLocalStore(createBoostStore);

  return (
    <View style={[theme.flexContainer, theme.backgroundPrimary]}>
      <BoostHeader title={i18n.t('boosts.boostChannel')} />
      <View style={[theme.flexContainer, theme.marginTop7x]}>
        <BoostInput localStore={localStore} />
      </View>
    </View>
  );
};

export default BoostChannelScreen;
