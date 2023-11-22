import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from '@expo/vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../../../styles/ThemedStyles';
import i18n from '../../../common/services/i18n.service';
import NavigationService from '../../../navigation/NavigationService';
import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { useNavCallback } from '../PosterOptions';
import Wrapper from './common/Wrapper';
import { useNavigation } from '@react-navigation/core';
import mindsService from '../../../common/services/minds-config.service';
import MText from '../../../common/components/MText';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from '../PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';

interface PropsType
  extends StackScreenProps<PosterStackParamList, 'MonetizeSelector'> {}

type IconItemPropsType = {
  isActive: boolean;
};

const IconItem = ({ isActive }: IconItemPropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View style={theme.rowJustifyStart}>
      {isActive && (
        <MIcon name="check" size={24} style={theme.colorSecondaryText} />
      )}
      <MIcon name="chevron-right" size={24} style={theme.colorSecondaryText} />
    </View>
  );
};

const MonetizeScreen = observer(({}: PropsType) => {
  const navigation = useNavigation();
  const theme = ThemedStyles.style;
  const store = useComposeContext();

  const support_tier_urn = mindsService.settings.plus.support_tier_urn;

  // const isCustomSelected =
  //   store.wire_threshold &&
  //   store.wire_threshold.support_tier &&
  //   !store.wire_threshold.support_tier.public &&
  //   store.wire_threshold.support_tier.urn !== support_tier_urn;

  const isMemembsershipSelected =
    store.wire_threshold &&
    store.wire_threshold.support_tier &&
    store.wire_threshold.support_tier.public;

  const isPlusSelected =
    store.wire_threshold &&
    store.wire_threshold.support_tier &&
    store.wire_threshold.support_tier.urn === support_tier_urn;

  const isActive = Boolean(
    store.wire_threshold && store.wire_threshold.support_tier,
  );

  return (
    <Wrapper store={store}>
      <MText
        style={[
          theme.paddingVertical6x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.paywallDescription')}
      </MText>
      <MenuItem
        onPress={() => store.clearWireThreshold()}
        title={i18n.t('monetize.none')}
        icon={!isActive ? 'check' : undefined}
        containerItemStyle={theme.bgPrimaryBackground}
        testID="monetizeNone"
      />
      <View style={theme.marginTop4x}>
        <MenuSubtitle>{i18n.t('monetize.options')}</MenuSubtitle>
        <MenuItem
          onPress={useNavCallback('PlusMonetize', store, navigation)}
          title={i18n.t('monetize.plus')}
          icon={<IconItem isActive={isPlusSelected} />}
          containerItemStyle={theme.bgPrimaryBackground}
          testID="monetizePlus"
        />
        <MenuItem
          onPress={() =>
            NavigationService.navigate('MembershipMonetize', {
              store,
              useForSelection: true,
            })
          }
          title={i18n.t('monetize.memberships')}
          icon={<IconItem isActive={isMemembsershipSelected} />}
          containerItemStyle={theme.bgPrimaryBackground}
          testID="monetizeMemberships"
        />
        {/* <MenuItem
          onPress={useNavCallback('CustomMonetize', store)}
          title={i18n.t('monetize.custom')}
          icon={<IconItem isActive={isCustomSelected} />}
          containerItemStyle={theme.bgPrimaryBackground}
          testID="monetizeCustom"
        /> */}
      </View>
    </Wrapper>
  );
});

export default MonetizeScreen;
