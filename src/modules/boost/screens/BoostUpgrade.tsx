import { observer } from 'mobx-react';
import React, { useCallback, useMemo } from 'react';
import MenuItem from '~/common/components/menus/MenuItem';
import useCurrentUser from '~/common/hooks/useCurrentUser';
import { B2, Column, H2, Screen, ScreenHeader } from '~/common/ui';

import sp from '~/services/serviceProvider';

const tinycolor = require('tinycolor2');

function BoostUpgrade() {
  const navigtionService = sp.navigation;
  const user = useCurrentUser();
  const lighterLinkColor = useMemo(
    () => tinycolor(sp.styles.getColor('Link')).brighten().toRgbString(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [sp.styles.theme],
  );

  const upgradePlus = useCallback(() => {
    navigtionService.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user?.togglePlus();
          navigtionService.goBack();
        }
      },
      pro: false,
    });
  }, [navigtionService, user]);

  const upgradePro = useCallback(() => {
    navigtionService.navigate('UpgradeScreen', {
      onComplete: (success: any) => {
        if (success) {
          user?.togglePro();
          navigtionService.goBack();
        }
      },
      pro: true,
    });
  }, [navigtionService, user]);

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
          underlayColor={sp.styles.getColor('TertiaryBackground')}
          containerItemStyle={styles.firstBox}
        />

        <MenuItem
          title="Upgrade to Minds Pro"
          subtitle="Get $50 / month or $480 / year in Boost credits"
          leftIcon="pro"
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

const styles = sp.styles.create({
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
