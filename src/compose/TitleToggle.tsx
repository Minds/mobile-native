import { observer } from 'mobx-react';
import React, { useCallback } from 'react';
import Icon from '@expo/vector-icons/SimpleLineIcons';
import { Button } from '../common/ui';
import sp from '~/services/serviceProvider';
/**
 * Title toggle
 * @param {Object} props
 */
function TitleToggle(props) {
  const theme = sp.styles.style;

  const onPress = useCallback(() => {
    props.store.toggleTitle();
  }, [props.store]);

  return (
    <Button
      size="pill"
      mode="flat"
      color="tertiary"
      onPress={onPress}
      icon={
        <Icon
          name={props.store.isTitleOpen ? 'minus' : 'plus'}
          size={16}
          style={theme.colorTertiaryText}
        />
      }>
      Title
    </Button>
  );
}

export default observer(TitleToggle);
