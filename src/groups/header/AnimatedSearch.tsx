import React from 'react';
import { debounce } from 'lodash';
import { observer, useLocalStore } from 'mobx-react';
import { AnimatePresence, MotiView } from 'moti';

import SearchView from '../../common/components/SearchView';
import i18n from '../../common/services/i18n.service';
import ThemedStyles from '../../styles/ThemedStyles';
import type GroupViewStore from '../GroupViewStore';

type PropsTypes = {
  store: GroupViewStore;
};

const searchContainerStyle = ThemedStyles.combine(
  'marginTop2x',
  'flexContainer',
  'hairLineBottom',
);

export default observer(function AnimatedSearch(props: PropsTypes) {
  const localStore = useLocalStore(() => ({
    search: '',
    setSearch(q) {
      this.search = q;
      props.store.setSearch(q);
      localStore.setDebouncedSearch(q);
    },
    setDebouncedSearch: debounce(q => {
      props.store.setSearch(q);
    }, 400),
    clearSearch() {
      this.search = '';
      props.store.setSearch('');
    },
  }));

  return (
    <AnimatePresence>
      {props.store.showSearch && (
        <MotiView
          from={{
            opacity: 0,
            height: 0,
            translateY: -25,
          }}
          animate={{
            opacity: 1,
            height: 55,
            translateY: 0,
          }}
          exit={{
            opacity: 0,
            height: 0,
            translateY: -25,
          }}
          transition={{
            height: { type: 'timing' },
            translateY: { type: 'spring' },
          }}>
          <SearchView
            containerStyle={searchContainerStyle}
            placeholder={i18n.t('discovery.search')}
            onChangeText={localStore.setSearch}
            value={localStore.search}
            iconRight={localStore.search ? 'close' : null}
            iconRightOnPress={localStore.clearSearch}
          />
        </MotiView>
      )}
    </AnimatePresence>
  );
});
