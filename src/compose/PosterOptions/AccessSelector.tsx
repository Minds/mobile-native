import React, { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { observer } from 'mobx-react';

import TopBar from '../TopBar';
import { ACCESS } from '~/common/services/list-options.service';
import { useComposeContext } from '~/compose/useComposeStore';
import MenuItemOption from '../../common/components/menus/MenuItemOption';
import sp from '~/services/serviceProvider';

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
  const theme = sp.styles.style;
  const store = useComposeContext();
  const i18n = sp.i18n;
  const navigation = sp.navigation;
  return (
    <View style={[theme.flexContainer, theme.bgPrimaryBackground]}>
      <TopBar
        leftText={i18n.t('visibility')}
        rightText={i18n.t('done')}
        backIconName="chevron-left"
        backIconSize="large"
        onPressRight={() => navigation.goBack()}
        onPressBack={() => navigation.goBack()}
        store={store}
      />
      <ScrollView>
        {ACCESS.map(o => (
          <Option
            key={o.text}
            option={o}
            store={store}
            selected={store.accessId === o.value}
          />
        ))}
      </ScrollView>
    </View>
  );
});
