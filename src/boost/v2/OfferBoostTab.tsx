import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, Text, TouchableOpacity, View } from 'react-native';
import InputContainer from '../../common/components/InputContainer';
import UserTypeahead from '../../common/components/user-typeahead/UserTypeahead';
import i18n from '../../common/services/i18n.service';
import sessionService from '../../common/services/session.service';
import ThemedStyles from '../../styles/ThemedStyles';
import BoostButton from './BoostButton';
import BoostPayment from './BoostPayment';
import { BoostStoreType } from './createBoostStore';

type PropsType = {
  localStore: BoostStoreType;
};

const OfferBoostTab = observer(({ localStore }: PropsType) => {
  const [searching, setSearching] = useState(false);
  const theme = ThemedStyles.style;
  useEffect(() => {
    localStore.setBoostType('offer');
  }, [localStore]);

  const selectTarget = (target) => {
    if (target.guid === sessionService.getUser().guid) {
      Alert.alert(
        i18n.t('error'),
        i18n.t('boosts.youCantSelectYourself'),
        [{ text: 'OK', onPress: () => {} }],
        { cancelable: false },
      );
    } else {
      localStore.setBoostOfferTarget(target);
      setSearching(false);
    }
  };

  const vPadding =
    Platform.OS === 'android' ? theme.paddingVertical0x : theme.paddingVertical;
  const marginB =
    Platform.OS === 'android' ? theme.marginBottom0x : theme.marginBottom;

  const commonProps = {
    keyboardType: 'decimal-pad',
    selectTextOnFocus: true,
    style: vPadding,
    containerStyle: theme.backgroundPrimaryHighlight,
    labelStyle: [marginB, theme.fontM],
  };
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
          {i18n.t('boosts.offersDescription')}
        </Text>
        <InputContainer
          placeholder={i18n.t('tokens')}
          onChangeText={localStore.setAmountTokens}
          value={localStore.amountTokens.toString()}
          {...commonProps}
        />
        <TouchableOpacity
          style={[
            theme.marginVertical5x,
            theme.paddingVertical2x,
            theme.paddingHorizontal4x,
            theme.backgroundPrimaryHighlight,
            theme.borderPrimary,
            theme.borderTop,
            theme.borderBottom,
          ]}
          onPress={() => setSearching(true)}>
          <Text style={[theme.fontM, theme.colorSecondaryText, marginB]}>
            {i18n.t('boosts.targetChannel')}
          </Text>
          <Text style={theme.fontL}>
            @{localStore.boostOfferTarget?.username || ''}
          </Text>
        </TouchableOpacity>
        <BoostPayment localStore={localStore} />
      </View>
      <BoostButton localStore={localStore} />
      <UserTypeahead
        //@ts-ignore
        isModalVisible={searching}
        onSelect={selectTarget}
        onClose={() => setSearching(false)}
      />
    </View>
  );
});

export default OfferBoostTab;
