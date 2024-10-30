import React, { useCallback } from 'react';
import { useBottomSheet } from '@gorhom/bottom-sheet';
import BottomSheet, { BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import { StyleSheet, View } from 'react-native';

import assets from '@assets';
import { BottomSheetButton } from '~/common/components/bottom-sheet';
import { Button, Screen, H3 } from '~/common/ui';
import { IS_IPAD, WELCOME_LOGO } from '~/config/Config';
import sp from '~/services/serviceProvider';
import { useGetSiteMembershipsAndSubscriptionsQuery } from '~/graphql/api';

export default function OnlyMembersScreen() {
  const i18n = sp.i18n;
  const onAccessPress = () => {
    sp.config.update();
  };
  const onLogOutPress = () => {
    sp.session.logout();
  };

  return (
    <Screen safe hasMaxWidth={false}>
      <View style={styles.container}>
        <Image
          contentFit="contain"
          source={
            WELCOME_LOGO === 'square'
              ? assets.LOGO_SQUARED
              : assets.LOGO_HORIZONTAL
          }
          style={WELCOME_LOGO === 'square' ? styles.imageSquare : styles.image}
        />

        <View style={styles.buttonContainer}>
          <Button
            type="action"
            font="medium"
            bottom="XL"
            containerStyle={styles.containerStyleButtons}
            testID="joinNowButton"
            onPress={onAccessPress}>
            {i18n.t('auth.accessAs', { name: 'Test' })}
          </Button>
          <Button
            darkContent
            font="medium"
            bottom="XL"
            containerStyle={styles.containerStyleButtons}
            onPress={onLogOutPress}>
            {i18n.t('auth.logOut')}
          </Button>
        </View>
      </View>
      <MembershipBottomSheet name="Test" />
    </Screen>
  );
}

const MembershipBottomSheet = ({ name }: { name: string }) => {
  const renderBackdrop = useCallback(
    props => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );

  const query = useGetSiteMembershipsAndSubscriptionsQuery();

  const membership = query.data?.siteMemberships?.[0];

  return membership ? (
    <BottomSheet
      index={0}
      snapPoints={[200]}
      backdropComponent={renderBackdrop}>
      <H3 horizontal="XL" align="center" font="regular" top="L">
        Only <H3>{membership.membershipName}</H3> members can access this
        community.
      </H3>
      <DismissButton />
    </BottomSheet>
  ) : null;
};

const DismissButton = () => {
  const { close } = useBottomSheet();
  return <BottomSheetButton text="Dismiss" onPress={close} />;
};

const styles = StyleSheet.create({
  buttonContainer: {
    padding: 32,
    alignItems: 'center',
  },
  containerStyleButtons: {
    width: IS_IPAD ? '45%' : '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  imageSquare: {
    marginTop: '15%',
    width: '80%',
    paddingHorizontal: 130,
    aspectRatio: 1,
    alignSelf: 'center',
  },
  image: {
    aspectRatio: 1.5,
    width: '65%',
    marginTop: '10%',
    maxHeight: '60%',
    alignSelf: 'center',
  },
});
