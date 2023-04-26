import { observer } from 'mobx-react';
import React from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import FitScrollView from '~/common/components/FitScrollView';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { B1, Button, Column, H2, Screen, ScreenHeader } from '~/common/ui';
import { showNotification } from '../../../../../AppMessages';
import { useTranslation } from '../../locales';
import { IBoostGoal, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';

type BoostGoalScreenProps = BoostStackScreenProps<'BoostGoal'>;

function BoostGoalScreen({ navigation, route }: BoostGoalScreenProps) {
  const { t } = useTranslation();
  const { safe, backIcon } = route.params ?? ({} as Record<string, string>);
  const boostStore = useBoostStore();

  if (!boostStore.config) {
    showNotification('Boost config not found', 'danger');
    navigation.goBack();
    return null;
  }

  const onNext = () => {
    if (boostStore.goal === 'following') {
      return navigation.push('BoostButton');
    }
    if (boostStore.goal === 'clicks') {
      return navigation.push('BoostLink');
    }

    navigation.push('BoostAudienceSelector');
  };

  const items: { id: IBoostGoal; title: string; subtitle: string }[] = [
    {
      id: 'reach',
      title: t('goal.reach'),
      subtitle: t('Get more people to see your post.'),
    },
    {
      id: 'engagement',
      title: t('goal.engagement'),
      subtitle: t('Get more Votes, Reminds, Comments, etc.'),
    },
    {
      id: 'following',
      title: t('goal.following'),
      subtitle: t('Gain more subscribers and grow your channel.'),
    },
    {
      id: 'clicks',
      title: t('goal.clicks'),
      subtitle: t(
        'Increase website traffic, app installs, or clicks on Minds.',
      ),
    },
  ];

  return (
    <Screen safe onlyTopEdge={!safe}>
      <ScreenHeader
        title={
          boostStore.boostType === 'channel'
            ? t('Boost Channel')
            : t('Boost Post')
        }
        back
        backIcon={backIcon}
        shadow
      />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Choose a goal')}</H2>
          <B1 color="secondary">{t('What do you want to focus on?')}</B1>
        </Column>

        <Column vertical="L" horizontal="M" top="L2">
          {items.map(item => (
            <MenuItemOption
              title={item.title}
              subtitle={item.subtitle}
              borderless
              mode="radio"
              selected={boostStore.goal === item.id}
              onPress={() => boostStore.setGoal(item.id)}
            />
          ))}
        </Column>
      </FitScrollView>
      <Button
        onPress={onNext}
        mode="solid"
        type="action"
        horizontal="L"
        bottom="L">
        {t('Next')}
      </Button>
    </Screen>
  );
}

export default withErrorBoundaryScreen(
  observer(BoostGoalScreen),
  'BoostGoalScreen',
);
