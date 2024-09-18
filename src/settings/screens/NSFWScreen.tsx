import React, { useCallback, useState, useEffect } from 'react';
import { View } from 'react-native';

import CenteredLoading from '../../common/components/CenteredLoading';
import MText from '../../common/components/MText';
import Switch from '~/common/components/controls/Switch';
import sp from '~/services/serviceProvider';

export default function () {
  const theme = sp.styles.style;

  const [matureContent, setMatureContent] = useState(false);
  const [loading, setLoading] = useState(true);

  /**
   * Get mature configuration
   */
  useEffect(() => {
    async function getMatureContent() {
      const { channel } = await sp.resolve('settingsApi').getSettings();
      setMatureContent(channel.mature);
      setLoading(false);
    }
    getMatureContent();
  }, [setMatureContent, setLoading]);

  /**
   * Save changes
   */
  const save = useCallback(
    async val => {
      setLoading(true);
      try {
        await sp.resolve('settingsApi').submitSettings({ mature: val });

        // set the value on the active user
        sp.session.getUser().setMature(val);

        setMatureContent(val);
      } catch (err) {
        setMatureContent(!val);
      }
      setLoading(false);
    },
    [setMatureContent, setLoading],
  );

  const component = loading ? (
    <CenteredLoading />
  ) : (
    <View
      style={[
        theme.flexContainer,
        theme.bgPrimaryBackground,
        theme.paddingTop4x,
      ]}>
      <View
        style={[
          styles.row,
          theme.bgSecondaryBackground,
          theme.paddingVertical3x,
          theme.paddingHorizontal3x,
          theme.bcolorPrimaryBorder,
          theme.borderTopHair,
          theme.borderBottomHair,
        ]}>
        <MText
          style={[theme.marginLeft, theme.colorSecondaryText, theme.fontL]}>
          {sp.i18n.t('settings.showMatureContent')}
        </MText>
        <Switch value={matureContent} onChange={save} />
      </View>
    </View>
  );

  return component;
}

const styles = {
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
};
