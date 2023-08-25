import { observer } from 'mobx-react';
import React from 'react';
import { withErrorBoundaryScreen } from '~/common/components/ErrorBoundaryScreen';
import FitScrollView from '~/common/components/FitScrollView';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import { B1, Button, Column, H2, Screen } from '~/common/ui';
import { showNotification } from '../../../../../AppMessages';
import { useTranslation } from '../../locales';
import { BoostGoal, useBoostStore } from '../boost.store';
import { BoostStackScreenProps } from '../navigator';
import BoostComposerHeader from '../components/BoostComposerHeader';

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
    if (boostStore.goal === BoostGoal.SUBSCRIBERS) {
      return navigation.push('BoostButton');
    }
    if (boostStore.goal === BoostGoal.CLICKS) {
      return navigation.push('BoostLink');
    }

    navigation.push('BoostAudienceSelector');
  };

  const items: { id: BoostGoal; title: string; subtitle: string }[] = [
    {
      id: BoostGoal.VIEWS,
      title: t(`goal.${BoostGoal.VIEWS}`),
      subtitle: t('Get more people to see your post.'),
    },
    {
      id: BoostGoal.ENGAGEMENT,
      title: t(`goal.${BoostGoal.ENGAGEMENT}`),
      subtitle: t('Get more Votes, Reminds, Comments, etc.'),
    },
    {
      id: BoostGoal.SUBSCRIBERS,
      title: t(`goal.${BoostGoal.SUBSCRIBERS}`),
      subtitle: t('Gain more subscribers and grow your channel.'),
    },
    {
      id: BoostGoal.CLICKS,
      title: t(`goal.${BoostGoal.CLICKS}`),
      subtitle: t(
        'Increase website traffic, app installs, or clicks on Minds.',
      ),
    },
  ];

  return (
    <Screen safe onlyTopEdge={!safe}>
      <BoostComposerHeader backIcon={backIcon} />
      <FitScrollView>
        <Column align="centerBoth" vertical="XL2">
          <H2>{t('Choose a goal')}</H2>
          <B1 color="secondary">{t('What do you want to focus on?')}</B1>
        </Column>

        <Column vertical="L" horizontal="M" top="L2">
          {items.map(item => (
            <MenuItemOption
              key={item.id}
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
