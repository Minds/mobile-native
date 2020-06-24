import React from 'react';
import { View, Text } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../../styles/ThemedStyles';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import TopBar from '../TopBar';
import MenuItem from '../../common/components/menus/MenuItem';
import MenuSubtitle from '../../common/components/menus/MenuSubtitle';
import { useLegacyStores } from '../../common/hooks/use-stores';
import { useNavCallback } from '../PosterOptions';
import Wrapper from './common/Wrapper';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AppStackParamList } from '../../navigation/NavigationTypes';

type MonetizeScreenRouteProp = RouteProp<AppStackParamList, 'MonetizeSelector'>;
type MonetizeScreenNavigationProp = StackNavigationProp<
  AppStackParamList,
  'MonetizeSelector'
>;

type PropsType = {
  route: MonetizeScreenRouteProp;
};

type ItemTextPropsType = {
  title: string;
  isActive: boolean;
};

const ItemText = ({ title, isActive }: ItemTextPropsType) => {
  const theme = ThemedStyles.style;
  return (
    <View
      style={[
        theme.rowJustifySpaceBetween,
        theme.paddingTop3x,
        theme.paddingBottom2x,
        theme.borderBottomHair,
        theme.borderPrimary,
      ]}>
      <Text>{title}</Text>
      {isActive && (
        <MIcon name="check" size={24} style={theme.colorSecondaryText} />
      )}
    </View>
  );
};

const MonetizeScreen = observer(({ route }: PropsType) => {
  const theme = ThemedStyles.style;
  const store = route.params.store;

  const isActive = Boolean(
    store.wire_threshold && store.wire_threshold.min > 0,
  );

  const checkIcon = (
    <MIcon name="check" size={24} style={theme.colorSecondaryText} />
  );

  return (
    <Wrapper store={store}>
      <Text
        style={[
          theme.paddingVertical6x,
          theme.colorSecondaryText,
          theme.fontL,
          theme.paddingHorizontal3x,
        ]}>
        {i18n.t('capture.paywallDescription')}
      </Text>
      <MenuItem
        item={{
          onPress: () => true,
          title: i18n.t('monetize.none'),
          icon: !isActive ? checkIcon : undefined,
          noIcon: isActive,
        }}
        backgroundPrimary={true}
        testID="monetizeNone"
      />
      <View style={theme.marginTop4x}>
        <MenuSubtitle>{i18n.t('monetize.options')}</MenuSubtitle>
        <MenuItem
          item={{
            onPress: useNavCallback('PlusMonetize', store),
            title: (
              <ItemText title={i18n.t('monetize.plus')} isActive={isActive} />
            ),
          }}
          backgroundPrimary={true}
          testID="monetizePlus"
        />
        <MenuItem
          item={{
            onPress: useNavCallback('MembershipMonetize', store),
            title: (
              <ItemText
                title={i18n.t('monetize.memberships')}
                isActive={isActive}
              />
            ),
          }}
          backgroundPrimary={true}
          testID="monetizeMemberships"
        />
        <MenuItem
          item={{
            onPress: useNavCallback('CustomMonetize', store),
            title: (
              <ItemText title={i18n.t('monetize.custom')} isActive={isActive} />
            ),
          }}
          backgroundPrimary={true}
          testID="monetizeCustom"
        />
      </View>
    </Wrapper>
  );
});

export default MonetizeScreen;
