import React from 'react';
import { observer } from 'mobx-react';
import { ScrollView, View } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { useStores } from '../../../../common/hooks/use-stores';
import type EmailNotificationsSettingModel from './EmailNotificationsSettingModel';
import MText from '../../../../common/components/MText';
import Empty from '~/common/components/Empty';
import { Button } from '~/common/ui';
import CenteredLoading from '~/common/components/CenteredLoading';
import MenuItemToggle from '../../../../common/components/menus/MenuItemToggle';
import MenuItemSelect from '../../../../common/components/menus/MenuItemSelect';

type PropsType = {};

const campaingTypes = [
  { tag: 'emailWhen', name: 'when' },
  { tag: 'emailWith', name: 'with' },
  { tag: 'emailUpdated', name: 'global' },
] as const;

const topicsWithSelector = ['unread_notifications', 'top_posts'];

type frecuencyOptionType = { frecuency: string; label: string };

const EmailNotificationsSettings = ({}: PropsType) => {
  const { notifications } = useStores();
  React.useEffect(() => {
    if (notifications.pushNotificationsSettings === null) {
      notifications.loadMailNotificationsSettings();
    }
  }, [notifications]);

  const frecuencyOptions = [
    {
      frecuency: 'never',
      label: i18n.t('notificationSettings.never'),
    },
    {
      frecuency: 'periodically',
      label: i18n.t('notificationSettings.periodically'),
    },
    { frecuency: 'daily', label: i18n.t('notificationSettings.daily') },
    { frecuency: 'weekly', label: i18n.t('notificationSettings.weekly') },
  ];

  const body =
    notifications.mailsNotificationsSettings &&
    notifications.mailsNotificationsSettings.length > 0 ? (
      <>
        {campaingTypes.map(campaignType => {
          return (
            <React.Fragment key={campaignType.tag}>
              <MText style={titleStyle}>
                {i18n.t(`notificationSettings.${campaignType.tag}`)}
              </MText>
              {notifications.mailsNotificationsSettings
                ?.filter(setting => setting.campaign === campaignType.name)
                .map((setting: EmailNotificationsSettingModel) => {
                  const isSelector = topicsWithSelector.includes(
                    setting._topic,
                  );
                  return (
                    <React.Fragment key={setting.guid}>
                      {!isSelector ? (
                        <MenuItemToggle
                          title={setting.topic}
                          value={setting.value !== '' && setting.value !== '0'}
                          onChange={() =>
                            setting.toggleValue(
                              setting.value === '1' ? '' : '1',
                            )
                          }
                        />
                      ) : (
                        <NotificationSelector
                          setting={setting}
                          frecuencyOptions={frecuencyOptions}
                        />
                      )}
                    </React.Fragment>
                  );
                })}
            </React.Fragment>
          );
        })}
      </>
    ) : !notifications.mailsNotificationsSettings ? (
      <Empty title={i18n.t('cantLoad')}>
        <Button
          top="L"
          onPress={() => notifications.loadMailNotificationsSettings()}
          type="action">
          {i18n.t('tryAgain')}
        </Button>
      </Empty>
    ) : (
      <CenteredLoading />
    );

  return (
    <View style={containerStyle}>
      <ScrollView>{body}</ScrollView>
    </View>
  );
};

const NotificationSelector = observer(
  ({
    setting,
    frecuencyOptions,
  }: {
    setting: EmailNotificationsSettingModel | undefined;
    frecuencyOptions: frecuencyOptionType[];
  }) => {
    if (!setting) {
      return null;
    }
    const parsedSettingValue =
      setting.value === '' || setting.value === '0'
        ? 'never'
        : setting.value === '1'
        ? 'periodically'
        : setting.value;

    return (
      <MenuItemSelect
        selectTitle={i18n.t('notificationSettings.frecuency')}
        title={setting.topic}
        data={frecuencyOptions}
        valueExtractor={item => item.label}
        keyExtractor={item => item.frecuency}
        onSelected={(frecuency: string) =>
          setting.toggleValue(frecuency === 'never' ? '' : frecuency)
        }
        selected={parsedSettingValue}
        backdropOpacity={0.99}
      />
    );
  },
);

export const titleStyle = ThemedStyles.combine(
  'fontMedium',
  'fontL',
  'colorSecondaryText',
  'marginBottom5x',
  'marginTop8x',
  'paddingLeft4x',
);
export const containerStyle = ThemedStyles.combine(
  'flexContainer',
  'paddingVertical2x',
);

export default observer(EmailNotificationsSettings);
