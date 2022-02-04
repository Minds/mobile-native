import React, { FC, useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { observer } from 'mobx-react';
import MIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import { ACCESS } from '~/common/services/list-options.service';
import MText from '../../common/components/MText';
import { StackScreenProps } from '@react-navigation/stack';
import { PosterStackParamList } from '~/compose/PosterOptions/PosterStackNavigator';
import { useComposeContext } from '~/compose/useComposeStore';

interface AccessSelectorProps
  extends FC,
    StackScreenProps<PosterStackParamList, 'AccessSelector'> {}

/**
 * Option
 * @param {Object} props
 */
const Option = props => {
  const onSelect = useCallback(() => {
    props.store.setAccessId(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <TouchableOpacity
      style={[styles.optsRow, ThemedStyles.style.bcolorPrimaryBorder]}
      onPress={onSelect}>
      <MText
        style={[ThemedStyles.style.flexContainer, ThemedStyles.style.fontL]}>
        {props.option.text}
      </MText>
      {props.selected && (
        <MIcon
          name="check"
          size={23}
          style={ThemedStyles.style.colorPrimaryText}
        />
      )}
    </TouchableOpacity>
  );
};

/**
 * Access selector
 */
export default observer(function ({}: AccessSelectorProps) {
  const theme = ThemedStyles.style;
  const store = useComposeContext();

  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText={i18n.t('visibility')}
        rightText={i18n.t('done')}
        backIconName="chevron-left"
        backIconSize="large"
        onPressRight={NavigationService.goBack}
        onPressBack={NavigationService.goBack}
        store={store}
      />
      <ScrollView>
        {ACCESS.map(o => (
          <Option
            option={o}
            store={store}
            selected={store.accessId === o.value}
          />
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  optsContainer: {
    marginBottom: 10,
  },
  optsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
});
