import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Trans } from 'react-i18next';
import { View } from 'react-native';
import MenuItem from '../common/components/menus/MenuItem';
import { storages } from '../common/services/storage/storages.service';
import { B2, Screen, ScreenHeader, Spacer } from '../common/ui';
import ThemedStyles from '../styles/ThemedStyles';
import ComposeIcon from './ComposeIcon';
import { ComposeScreenParams } from './ComposeScreen';

export default function ComposeCreateScreen() {
  const navigation = useNavigation();

  const texts = {
    post: {
      title: 'Post',
      subtitle: 'Create a post',
    },
    monetizedPost: {
      title: 'Monetized Post',
      subtitle:
        'Create a monetized post and make it exclusive to a selected audience',
    },
    boost: {
      title: 'Boost',
      subtitle:
        'Boost your post to make your content reach more users. Your content will appear on newsfeeds across the site',
    },
    supermind: {
      title: 'Supermind',
      subtitle:
        'Get replies from your favorite creators by sending them paid offers!',
    },
    description: 'Long press <compose /> to open this menu again',
  };

  const navigateToCompose = (params?: ComposeScreenParams) => {
    navigation.goBack();
    storages.user?.setBool('compose:create', true);
    navigation.navigate('Compose', params);
  };

  return (
    <Screen>
      <ScreenHeader title="Create" titleType="H2" centerTitle bottom="L" />
      <MenuItem
        title={texts.post.title}
        subtitle={texts.post.subtitle}
        leftIcon="radio-button-on"
        borderless
        onPress={() => navigateToCompose()}
        containerItemStyle={ThemedStyles.style.marginTop4x}
      />
      <MenuItem
        title={texts.monetizedPost.title}
        subtitle={texts.monetizedPost.subtitle}
        leftIcon="money"
        borderless
        // open compose with audience set to an onboarding prompt like "Select audience"
        onPress={() => navigateToCompose()}
      />
      <MenuItem
        title={texts.boost.title}
        subtitle={texts.boost.subtitle}
        leftIcon="boost"
        borderless
        // show information, create post, then boost it
        onPress={() =>
          navigateToCompose({
            boost: true,
          })
        }
      />
      <MenuItem
        title={texts.supermind.title}
        subtitle={texts.supermind.subtitle}
        leftIcon="supermind"
        borderless
        onPress={() =>
          navigateToCompose({
            openSupermindModal: true,
          })
        }
      />
      <B2 color="secondary" align="center" top="L">
        <Trans
          i18nKey="myKey" // optional -> fallbacks to defaults if not provided
          defaults={texts.description} // optional defaultValue
          components={{
            compose: <Compose />,
          }}
        />
      </B2>
      <Spacer top="XXXL2" />
    </Screen>
  );
}

const Compose = () => (
  <View>
    <ComposeIcon style={styles.composeIcon} />
  </View>
);

const styles = {
  composeIcon: {
    width: 20,
    height: 20,
    top: 4,
  },
};
