import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react';
import ThemedStyles from '../../styles/ThemedStyles';
import TopBar from '../TopBar';
import i18n from '../../common/services/i18n.service';
import NavigationService from '../../navigation/NavigationService';
import { ACCESS } from '~/common/services/list-options.service';
import { useComposeContext } from '~/compose/useComposeStore';
import MenuItemOption from '../../common/components/menus/MenuItemOption';

/**
 * Option
 * @param {Object} props
 */
const Option = props => {
  const onSelect = useCallback(() => {
    props.store.setAccessId(props.option.value);
  }, [props.store, props.option.value]);

  return (
    <MenuItemOption
      title={props.option.text}
      onPress={onSelect}
      selected={props.selected}
    />
  );
};

/**
 * Access selector
 */
export default observer(function () {
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
