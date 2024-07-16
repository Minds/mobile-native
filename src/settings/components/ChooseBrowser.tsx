import { observer, useLocalStore } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import { SectionTitle } from '~/common/components/bottom-sheet';
import SectionSubtitle from '~/common/components/bottom-sheet/SectionSubtitle';
import MenuItemOption from '~/common/components/menus/MenuItemOption';

import sp from '~/services/serviceProvider';

type PropsType = {
  onSelected?: () => void;
};

/**
 * Browser Selector Component
 */
const ChooseBrowser = (props: PropsType) => {
  const i18n = sp.i18n;
  const store = useLocalStore(
    p => ({
      browser: sp.resolve('openURL').preferredBrowser,
      setBrowser(value: 0 | 1) {
        store.browser = value;
        sp.resolve('openURL').setPreferredBrowser(value);
        if (p.onSelected) {
          setTimeout(() => {
            p.onSelected && p.onSelected();
          }, 500);
        }
      },
      optionInApp: {
        title: i18n.t('settings.inAppBrowser'),
        onPress: () => store.setBrowser(0),
      },
      optionDefault: {
        title: i18n.t('settings.defaultBrowser'),
        onPress: () => store.setBrowser(1),
      },
    }),
    props,
  );

  return (
    <>
      <View style={sp.styles.style.paddingBottom3x}>
        <SectionTitle>
          {i18n.t('settings.chooseBrowserDescription')}
        </SectionTitle>
      </View>
      <MenuItemOption {...store.optionInApp} selected={store.browser === 0} />
      <MenuItemOption {...store.optionDefault} selected={store.browser === 1} />
      <View style={sp.styles.style.paddingTop6x}>
        <SectionSubtitle>
          {i18n.t('settings.chooseBrowserHint')}
        </SectionSubtitle>
      </View>
    </>
  );
};

export default observer(ChooseBrowser);
