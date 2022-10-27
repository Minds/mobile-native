import React from 'react';
import { View, Animated, Text, Button } from 'react-native';
import { useTranslation } from '../../locales';
import { ImageOverlay } from '../../components';
// import { useNavigation } from '@react-navigation/native';
import { ScrollView } from 'react-native-gesture-handler';

// const BOTTOM_OFFSET = 2 > 1 ? 50 : 60;
// const minHeight = Platform.OS === 'android' ? 206 : 2 > 1 ? 150 : 216;

export function ResetAccountScreen(): React.ReactElement {
  // const { goBack } = useNavigation();
  // const [email, setEmail] = React.useState<string>();
  const { t } = useTranslation();
  // const { translateStyle } = useKeyboardTranslation(BOTTOM_OFFSET);

  const onNextButtonPress = () => null;
  const onBackButtonPress = () => null;

  return (
    <ScrollView>
      <ImageOverlay source={{}}>
        <View style={[]}>
          <Text testID="reset-account-heading">{t('Reset your account')}</Text>
          <Text testID="enter-username-subheading">
            {t('Please enter your username')}
          </Text>
        </View>
        <View style={[]}>
          {/* <Input
            testID="username-input-reset"
            size="large"
            status="control"
            placeholder={t('Username')}
            autoFocus
            autoCorrect={false}
            autoCapitalize={'none'}
            accessoryLeft={props => <Icon {...props} name="person" />}
            value={email}
            onChangeText={setEmail}
          /> */}
        </View>
        <Animated.View style={[]}>
          <Button title="" testID="next-button" onPress={onNextButtonPress}>
            {t('Next')}
          </Button>
        </Animated.View>
        <Button title="" testID="go-back-button" onPress={onBackButtonPress}>
          {t('Go back')}
        </Button>
      </ImageOverlay>
    </ScrollView>
  );
}
