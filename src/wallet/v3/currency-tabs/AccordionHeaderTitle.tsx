import { useNavigation } from '@react-navigation/core';
import { observer } from 'mobx-react';
import React from 'react';
import sessionService from '../../../common/services/session.service';
import { getFriendlyLabel } from './EarningsOverview';
import { B1, B2, Column } from '~ui';
import { useIsFeatureOn } from 'ExperimentsProvider';

type PropsType = {
  earningId: string;
};

const AccordionHeaderTitle = observer(({ earningId }: PropsType) => {
  const user = sessionService.getUser();
  const navigation = useNavigation();
  const IOS_IAP_ENABLED = useIsFeatureOn('mob-4990-iap-subscription-ios');

  const onCompletePro = success => {
    if (success) {
      user.togglePro();
    }
  };

  const onCompletePlus = success => {
    if (success) {
      user.togglePlus();
    }
  };

  const navToPro = () =>
    navigation.navigate('UpgradeScreen', {
      onComplete: onCompletePro,
      pro: true,
    });
  const navToPlus = () =>
    navigation.navigate('UpgradeScreen', {
      onComplete: onCompletePlus,
      pro: false,
    });

  return (
    <Column flex>
      <B1 font="medium">{getFriendlyLabel(earningId)}</B1>
      {earningId === 'partner' && !user.pro && IOS_IAP_ENABLED && (
        <B2>
          Upgrade to{' '}
          {!user.plus && (
            <B2 font="medium" color="link" onPress={navToPlus}>
              plus
            </B2>
          )}
          {!user.plus ? ' or ' : ' '}
          <B2 font="medium" color="link" onPress={navToPro}>
            pro
          </B2>
        </B2>
      )}
    </Column>
  );
});

export default AccordionHeaderTitle;
