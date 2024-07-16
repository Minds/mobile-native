import Util from '../helpers/util';
import logService from '../services/log.service';
import { useLocalStore } from 'mobx-react';
import { useService } from '~/services/hooks/useService';

/**
 * Local embed store hook
 */
export default function () {
  const richEmbedService = useService('richEmbed');
  const store = useLocalStore(() => ({
    hasRichEmbed: false,
    metaInProgress: false,
    meta: null,
    richEmbedUrl: '',
    _richEmbedFetchTimer: null,
    setRichEmbedPromise: null, // used for testing

    /**
     * Richembed check
     */
    check: text => {
      const matches = Util.urlReSingle.exec(text);

      if (store._richEmbedFetchTimer) {
        clearTimeout(store._richEmbedFetchTimer);
      }

      if (matches) {
        const url =
          (!(
            matches[0].startsWith('https://') ||
            matches[0].startsWith('http://')
          )
            ? 'https://'
            : '') + matches[0];

        if (
          !store.hasRichEmbed ||
          (store.hasRichEmbed &&
            url.toLowerCase() !== store.richEmbedUrl.toLowerCase())
        ) {
          store._richEmbedFetchTimer = setTimeout(
            () => (store.setRichEmbedPromise = store.set(url)),
            750,
          );
        }
      }
    },

    /**
     * Clear rich embed
     */
    clearAction: () => {
      store.clear();

      if (store._richEmbedFetchTimer) {
        clearTimeout(store._richEmbedFetchTimer);
      }
    },

    /**
     * Clear rich embed
     */
    clear() {
      store.hasRichEmbed = false;
      store.richEmbedUrl = '';
      store.meta = null;
    },

    /**
     * Set rich embed
     * @param {string} url
     */
    async set(url) {
      store.hasRichEmbed = true;
      store.richEmbedUrl = url;
      store.meta = null;
      store.metaInProgress = true;

      try {
        const meta = await richEmbedService.getMeta(url);
        store.meta = meta;
        store.metaInProgress = false;
      } catch (e) {
        store.metaInProgress = false;
        logService.exception('[RichEmbedStore]', e);
      }
    },
  }));

  return store;
}
