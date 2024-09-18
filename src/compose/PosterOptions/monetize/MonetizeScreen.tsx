import React from 'react';
import { View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from '@expo/vector-icons/MaterialCommunityIcons';

import MenuItem from '../../../common/components/menus/MenuItem';
import MenuSubtitle from '../../../common/components/menus/MenuSubtitle';
import { useNavCallback } from '../PosterOptions';
import Wrapper from './common/Wrapper';
import { useNavigation } from '@react-navigation/core';
import MText from '../../../common/components/MText';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from '../PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';
import sp from '~/services/serviceProvider';

interface PropsType
  extends StackScreenProps<PosterStackParamList, 'MonetizeSelector'> {}

type IconItemPropsType = {
  isActive: boolean;
};

const IconItem = ({ isActive }: IconItemPropsType) => {
  const theme = sp.styles.style;
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
  const theme = sp.styles.style;
  const store = useComposeContext();

  const support_tier_urn = sp.config.settings.plus.support_tier_urn;

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
  const i18n = sp.i18n;

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
            sp.navigation.navigate('MembershipMonetize', {
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
