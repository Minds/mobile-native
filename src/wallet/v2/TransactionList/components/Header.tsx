import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import ThemedStyles from '../../../../styles/ThemedStyles';
import i18n from '../../../../common/services/i18n.service';
import { AvatarIcon } from './Icons';

type PropsType = {
  showFilter: () => void;
};

const Header = ({ showFilter }: PropsType) => {
  const theme = ThemedStyles.style;
  const alignedCenterRow = [theme.rowJustifyStart, theme.alignCenter];

  return (
    <View style={theme.marginBottom3x}>
      <View style={[theme.rowJustifySpaceBetween, theme.alignCenter]}>
        <Text style={theme.colorSecondaryText}>
          {i18n.t('wallet.transactions.pending')}
        </Text>
        {/* <TouchableOpacity onPress={() => true}> */}
        <View style={alignedCenterRow}>
          <TouchableOpacity onPress={showFilter}>
            <MIcon
              name={'filter-variant'}
              color={ThemedStyles.getColor('icon')}
              size={28}
            />
            <Text style={theme.colorSecondaryText}>
              {i18n.t('wallet.transactions.filter')}
            </Text>
          </TouchableOpacity>
        </View>
        {/* </TouchableOpacity> */}
      </View>
      <View style={alignedCenterRow}>
        <AvatarIcon name="trending-up" />
        <Text style={theme.colorPrimaryText}>
          {i18n.t('wallet.transactions.reward')}
        </Text>
      </View>
    </View>
  );
};

export default Header;
