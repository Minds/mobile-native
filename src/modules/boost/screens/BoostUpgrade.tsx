import { Icon } from '@minds/ui';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import MenuItem from '~/common/components/menus/MenuItem';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import { B2, Column, H2, Screen, ScreenHeader } from '~/common/ui';
import NavigationService from '~/navigation/NavigationService';
import ThemedStyles from '~/styles/ThemedStyles';

const tinycolor = require('tinycolor2');

function BoostUpgrade() {
  const user = useCurrentUser();
  const lighterLinkColor = useMemo(
    () => tinycolor(ThemedStyles.getColor('Link')).brighten().toRgbString(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [ThemedStyles.theme],
  );

  const upgradePlus = useCallback(() => {
    NavigationService.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user?.togglePlus();
          NavigationService.goBack();
        }
      },
      pro: false,
    });
  }, [user]);

  const upgradePro = useCallback(() => {
    NavigationService.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user?.togglePro();
          NavigationService.goBack();
        }
      },
      pro: true,
    });
  }, [user]);

  return (
    <Screen scroll safe>
      <ScreenHeader back backIcon="close" />

      <Column horizontal="XXL2">
        <H2>{'Upgrade and get your\nnext boost free'}</H2>
        <B2 top="XL" bottom="XXL2" color="secondary">
          Unleash the full power of Minds+ or Pro by subscribing and get a
          chance to have your next boost be free through Boost credits!
        </B2>

        <MenuItem
          title="Upgrade to Minds+"
          subtitle="Get $7 / month or $50 / year in Boost credits"
          leftIcon="queue"
          onPress={upgradePlus}
          iconColor="PrimaryText"
          underlayColor={ThemedStyles.getColor('TertiaryBackground')}
          containerItemStyle={styles.firstBox}
        />

        <MenuItem
          title="Upgrade to Minds Pro"
          subtitle="Get $50 / month or $480 / year in Boost credits"
          leftIcon={<Icon name="mindsPro" size={24} />}
          onPress={upgradePro}
          primaryColor="Black"
          secondaryColor="black"
          iconColor="Black"
          underlayColor={lighterLinkColor}
          containerItemStyle={styles.secondBox}
        />
      </Column>
    </Screen>
  );
}

const styles = ThemedStyles.create({
  firstBox: [
    'bgSecondaryBackground',
    {
      borderRadius: 4,
      height: 150,
      marginBottom: 50,
    },
  ],
  secondBox: [
    'bgLink',
    {
      borderRadius: 4,
      height: 150,
    },
  ],
});

export default observer(BoostUpgrade);
