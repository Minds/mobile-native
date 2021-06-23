import React from 'react';
import { observer } from 'mobx-react';
import { Text, ScrollView, View } from 'react-native';
import i18n from '../../../../common/services/i18n.service';
import ThemedStyles from '../../../../styles/ThemedStyles';
import { useStores } from '../../../../common/hooks/use-stores';
import MenuItem from '../../../../common/components/menus/MenuItem';
import type EmailNotificationsSettingModel from './EmailNotificationsSettingModel';
import InputSelector from '../../../../common/components/InputSelector';
import Toggle from '../../../../common/components/Toggle';

type PropsType = {};

const campaingTypes = [
  { tag: 'emailWhen', name: 'when' },
  { tag: 'emailWith', name: 'with' },
  { tag: 'emailUpdated', name: 'global' },
];

const topicsWithSelector = ['unread_notifications', 'top_posts'];

type frecuencyOptionType = { frecuency: string; label: string };

const EmailNotificationsSettings = ({}: PropsType) => {
  const theme = ThemedStyles.style;
  const { notifications } = useStores();
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
  return (
    <View style={containerStyle}>
      <ScrollView>
        {campaingTypes.map(campaignType => {
          return (
            <>
              <Text style={titleStyle}>
                {i18n.t(`notificationSettings.${campaignType.tag}`)}
              </Text>
              {notifications.mailsNotificationsSettings.map(
                (setting: EmailNotificationsSettingModel) => {
                  if (setting.campaign !== campaignType.name) {
                    return null;
                  }
                  const isSelector = topicsWithSelector.includes(
                    setting._topic,
                  );
                  return (
                    <>
                      {!isSelector && (
                        <MenuItem
                          item={{
                            title: setting.topic,
                            icon: <SettingToggle setting={setting} />,
                          }}
                          containerItemStyle={theme.bgPrimaryBackground}
                          titleStyle={itemTextStyleMedium}
                        />
                      )}
                      {isSelector && (
                        <NotificationSelector
                          setting={setting}
                          frecuencyOptions={frecuencyOptions}
                        />
                      )}
                    </>
                  );
                },
              )}
            </>
          );
        })}
      </ScrollView>
    </View>
  );
};

const SettingToggle = observer(
  ({ setting }: { setting: EmailNotificationsSettingModel | undefined }) => {
    if (!setting) {
      return null;
    }
    const value = setting.value !== '' && setting.value !== '0';
    return (
      <Toggle
        onValueChange={() =>
          setting.toggleValue(setting.value === '1' ? '' : '1')
        }
        value={value}
      />
    );
  },
);

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
      <>
        <InputSelector
          selectTitle={i18n.t('notificationSettings.frecuency')}
          label={setting.topic}
          data={frecuencyOptions}
          valueExtractor={item => item.label}
          keyExtractor={item => item.frecuency}
          onSelected={(frecuency: string) => {
            setting.toggleValue(frecuency === 'never' ? '' : frecuency);
          }}
          selected={parsedSettingValue}
          containerStyle={selectorContainer}
          textStyle={itemTextStyleMedium}
          labelStyle={itemTextStyleMedium}
          mainContainerStyle={selectorMainContainer}
          backdropOpacity={0.99}
        />
      </>
    );
  },
);

const selectorContainer = ThemedStyles.combine(
  'bgPrimaryBackground',
  'borderLeft0x',
  'borderRight0x',
);

const selectorMainContainer = ThemedStyles.combine('paddingTop0x');
export const titleStyle = ThemedStyles.combine(
  'fontMedium',
  'fontL',
  'colorSecondaryText',
  'marginBottom5x',
  'marginTop8x',
  'paddingLeft4x',
);

export const itemTextStyle = ThemedStyles.combine('fontL', 'colorPrimaryText');

export const itemTextStyleMedium = ThemedStyles.combine(
  'fontMedium',
  'fontL',
  'colorPrimaryText',
);

export const containerStyle = ThemedStyles.combine(
  'flexContainer',
  'bgSecondaryBackground',
  'paddingVertical2x',
);

export default EmailNotificationsSettings;
