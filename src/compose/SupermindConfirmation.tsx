import { useDimensions } from '@react-native-community/hooks';
import { useRoute } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { InteractionManager, Keyboard } from 'react-native';
import FitScrollView from '~/common/components/FitScrollView';
import SmartImage from '~/common/components/SmartImage';
import MenuItemOption from '~/common/components/menus/MenuItemOption';
import i18n from '~/common/services/i18n.service';
import { B1, B2, Button, Column, H3, Screen, ScreenHeader } from '~/common/ui';
import ThemedStyles, { useMemoStyle } from '~/styles/ThemedStyles';
import { UNIT } from '~/styles/Tokens';

export interface SupermindConfirmationRouteParams {
  requiresTwitter?: boolean;
  onConfirm: () => void;
  onDismiss: () => void;
}

export default function SupermindConfirmation() {
  const route = useRoute();
  const params = route.params as SupermindConfirmationRouteParams;
  const texts = {
    screenTitle: i18n.t('supermind.supermind'),
    title: i18n.t('supermind.confirm.title'),
    description: i18n.t('supermind.confirm.description'),
    twitter: {
      title: i18n.t('supermind.confirm.twitter.title'),
      subtitle: i18n.t('supermind.confirm.twitter.description'),
    },
    example: i18n.t('supermind.confirm.twitter.example'),
    confirm: i18n.t('confirm'),
  };
  const { width } = useDimensions().screen;
  const imageStyle = useMemoStyle(
    [
      'marginHorizontal2x',
      {
        width: width - UNIT.L2 * 2,
        aspectRatio: 1.3,
        borderRadius: 8,
        overflow: 'hidden',
      },
    ],
    [width],
  );

  useEffect(() => {
    Keyboard.dismiss();
    return () => params?.onDismiss?.();
  }, [params]);

  return (
    <Screen>
      <ScreenHeader
        title={texts.screenTitle}
        back
        backIcon="close"
        centerTitle
        extra={
          <Button mode="flat" type="action" onPress={params?.onConfirm}>
            {texts.confirm}
          </Button>
        }
        border
      />

      <FitScrollView>
        <Column top="L2" space="L">
          <H3 horizontal="L" bottom="M">
            {texts.title}
          </H3>
          <B2 horizontal="L" bottom="M">
            {texts.description}
          </B2>

          {params.requiresTwitter && (
            <>
              <MenuItemOption
                selected
                title={texts.twitter.title}
                subtitle={texts.twitter.subtitle}
                titleStyle={ThemedStyles.style.marginBottom2x}
                disabled
                mode="checkbox"
                borderless
                reversedIcon
              />

              <B1 horizontal="L" font="bold" vertical="M">
                {texts.example}
              </B1>
              <SmartImage
                source={{
                  uri: 'https://www.minds.com/static/en/assets/twitter-supermind-placeholder.png',
                }}
                placeholder="L+Mt8[Ng%LjFD+bIoyae_JsjRkf+"
                contentFit="cover"
                style={imageStyle}
              />
            </>
          )}
        </Column>
      </FitScrollView>
    </Screen>
  );
}

export function confirmSupermindReply(
  navigation,
  requiresTwitter: boolean,
): Promise<boolean> {
  return new Promise(resolve => {
    navigation.push('SupermindConfirmation', {
      requiresTwitter,
      onConfirm: () => {
        navigation.goBack?.();
        InteractionManager.runAfterInteractions(() => resolve(true));
      },
      onDismiss: () => resolve(false),
    });
  });
}
