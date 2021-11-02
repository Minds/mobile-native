import { observer, useLocalStore } from 'mobx-react-lite';
import React from 'react';
import { View } from 'react-native';
import { SectionTitle } from '~/common/components/bottom-sheet';
import SectionSubtitle from '~/common/components/bottom-sheet/SectionSubtitle';
import MenuOption from '~/common/components/menus/MenuOption';
import i18n from '~/common/services/i18n.service';
import openUrlService from '~/common/services/open-url.service';
import ThemedStyles from '~/styles/ThemedStyles';

type PropsType = {
  onSelected?: () => void;
};

/**
 * Browser Selector Component
 */
const ChooseBrowser = (props: PropsType) => {
  const store = useLocalStore(
    p => ({
      browser: openUrlService.preferredBrowser,
      setBrowser(value: 0 | 1) {
        store.browser = value;
        openUrlService.setPreferredBrowser(value);
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
      <View style={ThemedStyles.style.paddingBottom3x}>
        <SectionTitle>
          {i18n.t('settings.chooseBrowserDescription')}
        </SectionTitle>
      </View>
      <MenuOption item={store.optionInApp} selected={store.browser === 0} />
      <MenuOption item={store.optionDefault} selected={store.browser === 1} />
      <View style={ThemedStyles.style.paddingTop6x}>
        <SectionSubtitle>
          {i18n.t('settings.chooseBrowserHint')}
        </SectionSubtitle>
      </View>
    </>
  );
};

export default observer(ChooseBrowser);
