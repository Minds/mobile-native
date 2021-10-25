import React from 'react';
import { observer } from 'mobx-react';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import { B1S, Row, PressableLine } from '~ui';
interface Props {
  navigation: any;
}

const SearchComponent = observer((props: Props) => {
  return (
    <Row left="M" flex>
      <PressableLine
        onPress={() => props.navigation.navigate('SearchScreen')}
        underlayColor="transparent">
        <B1S vertical="XS" color="secondary">
          {i18n.t('searchBar.title')}
        </B1S>
      </PressableLine>
    </Row>
  );
});

export default SearchComponent;
