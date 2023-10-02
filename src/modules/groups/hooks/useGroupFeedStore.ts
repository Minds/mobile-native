import { useLocalStore } from 'mobx-react';
import { useEffect } from 'react';
import FeedStore from '~/common/stores/FeedStore';
import type GroupModel from '~/groups/GroupModel';

export type GroupFeedAlgorithms = 'latest' | 'top';

export function useGroupFeedStore(group: GroupModel) {
  const store = useLocalStore(() => ({
    feed: new FeedStore(true),
    feedTop: new FeedStore(true),
    search: '',
    showSearch: false,
    toggleSearch() {
      this.showSearch = !this.showSearch;
      if (!this.showSearch) {
        this.setSearch('');
      }
    },
    setSearch(value: string) {
      this.search = value;

      const params = value
        ? {
            period: 'all',
            all: 1,
            query: this.search,
            sync: 1,
          }
        : { algorithm: 'latest' };
      this.feed.clear().setParams(params).fetchRemoteOrLocal();
    },
  }));

  useEffect(() => {
    store.feed.getMetadataService()?.setSource('feed/groups').setMedium('feed');
    store.feedTop
      .getMetadataService()
      ?.setSource('top-feed/groups')
      .setMedium('feed');

    store.feed
      .setEndpoint(`api/v2/feeds/container/${group.guid}/activities`)
      .setInjectBoost(Boolean(group.show_boosts))
      .setParams({ algorithm: 'latest' })
      .setLimit(12)
      .fetchRemoteOrLocal();

    store.feedTop
      .setEndpoint(`api/v2/feeds/container/${group.guid}/activities`)
      .setParams({ algorithm: 'top' })
      .setInjectBoost(Boolean(group.show_boosts))
      .setLimit(12)
      .fetchRemoteOrLocal();
  }, [group.guid, store]);

  return store;
}

export type GroupFeedStoreType = ReturnType<typeof useGroupFeedStore>;
