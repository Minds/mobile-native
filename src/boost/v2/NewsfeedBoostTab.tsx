import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Text, View } from 'react-native';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostButton from './BoostButton';
import BoostInput from './BoostInput';
import BoostPayment from './BoostPayment';
import { BoostStoreType } from './createBoostStore';

type PropsType = {
  localStore: BoostStoreType;
};

const NewsfeedBoostTab = observer(({ localStore }: PropsType) => {
  const theme = ThemedStyles.style;
  useEffect(() => {
    localStore.setBoostType('post');
  }, [localStore]);
  return (
    <View style={[theme.flexContainer, theme.marginTop5x]}>
      <View style={theme.marginBottom4x}>
        <Text
          style={[
            theme.colorSecondaryText,
            theme.fontL,
            theme.paddingHorizontal6x,
            theme.marginBottom4x,
          ]}>
          {i18n.t('boosts.feedsDescription')}
        </Text>
        <BoostInput localStore={localStore} />
        <BoostPayment localStore={localStore} />
      </View>
      <BoostButton localStore={localStore} />
    </View>
  );
});

export default NewsfeedBoostTab;
