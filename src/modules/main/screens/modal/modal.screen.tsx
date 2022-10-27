import React from 'react';
import {
  Button,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParams } from '../../navigator';
import { useTranslation } from 'react-i18next';

const styles = StyleSheet.create({
  title: { textTransform: 'capitalize' },
});

export default function ModalScreen(): JSX.Element {
  const route = useRoute<RouteProp<RootStackParams, 'Modal'>>();

  const { message, title, secondAction, dismissAfter } = route.params;
  const navigation = useNavigation();
  const { t } = useTranslation('mainModule');

  React.useEffect(() => {
    if (dismissAfter) {
      // setTimeout(() => {
      //   navigation.goBack();
      // }, dismissAfter);
    }
  }, [dismissAfter, navigation]);

  return (
    <View style={[]}>
      <Pressable onPress={Keyboard.dismiss} style={[]}>
        <Text style={[styles.title]}>{title}</Text>
        <Text style={[]}>
          {t(
            'Something has gone wrong. Should this error continue please contact our helpdesk',
          )}
        </Text>
        <Text style={[]}>{`${t('Error')} - ${message}`}</Text>
        <View style={[]}>
          {!dismissAfter && (
            <Button title="" onPress={() => navigation.goBack()}>
              {t('Ok')}
            </Button>
          )}

          {secondAction && (
            <>
              <View style={[]} />
              <Button
                title=""
                onPress={() => {
                  secondAction();
                  navigation.goBack();
                }}>
                {t('Retry')}
              </Button>
            </>
          )}
        </View>
      </Pressable>
    </View>
  );
}

export { ModalScreen };
