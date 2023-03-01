import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import { View } from 'react-native';
import { Flow } from 'react-native-animated-spinkit';
import { IconButton, IconButtonNext } from '~ui/icons';
import { confirm } from '../common/components/Confirm';
import MText from '../common/components/MText';
import SupermindLabel from '../common/components/supermind/SupermindLabel';
import i18n from '../common/services/i18n.service';
import { Row } from '../common/ui';
import ThemedStyles from '../styles/ThemedStyles';
import type { ComposeStoreType } from './useComposeStore';
import AudienceSelector from './ComposeAudienceSelector';

interface ComposeTopBarProps {
  onPressBack: () => void;
  store: ComposeStoreType;
}

/**
 * Compose Top bar
 */
export default observer(function ComposeTopBar(props: ComposeTopBarProps) {
  const { store } = props;
  const theme = ThemedStyles.style;

  const onPressPost = useCallback(async () => {
    if (store.attachments.uploading) {
      return;
    }
    const { channel: targetChannel, payment_options } =
      store.supermindRequest ?? {};

    if (
      targetChannel?.name &&
      payment_options?.amount &&
      !(await confirm({
        title: i18n.t('supermind.confirmNoRefund.title'),
        description: i18n.t('supermind.confirmNoRefund.offerDescription'),
      }))
    ) {
      return;
    }

    const isEdit = store.isEdit;
    const entity = await store.submit();

    if (entity) {
      store.onPost(entity, isEdit);
    }
  }, [store]);

  const rightButton = props.store.posting ? (
    <View style={styles.dotIndicatorContainerStyle}>
      <Flow color={ThemedStyles.getColor('SecondaryText')} />
    </View>
  ) : store.isEdit ? (
    <MText style={styles.postButton} onPress={onPressPost} testID="topBarDone">
      {i18n.t('save')}
    </MText>
  ) : (
    <IconButtonNext
      name="send"
      size="medium"
      scale
      onPress={onPressPost}
      disabled={!store.isValid}
      color={store.isValid ? 'Link' : 'Icon'}
      style={store.attachments.uploading ? theme.opacity25 : null}
    />
  );

  return (
    <Row vertical="S" left="XS" right="L">
      <IconButton
        size={30}
        name="close"
        style={styles.back}
        onPress={props.onPressBack}
        testID="topbarBack"
      />
      {(store.supermindRequest || store.isSupermindReply) && <SupermindLabel />}
      <View style={theme.flexContainer} />
      <AudienceSelector store={store} />
      {rightButton}
    </Row>
  );
});

const styles = ThemedStyles.create({
  dotIndicatorContainerStyle: ['rowJustifyEnd'],
  topBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingLeft: 5,
  },
  leftText: [
    'textCenter',
    {
      position: 'absolute',
      textAlign: 'center',
      fontSize: 20,
    },
  ],
  postButton: {
    textAlign: 'right',
    fontSize: 18,
  },
  back: ['colorIcon', 'paddingLeft2x', 'paddingRight2x'],
});
