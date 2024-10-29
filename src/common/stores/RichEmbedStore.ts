import { observable, action, runInAction } from 'mobx';
import Util from '../helpers/util';
import { Timeout } from '~/types/Common';
import sp from '~/services/serviceProvider';

export type MetaType = {
  thumbnail?: string;
  title?: string;
  url: string;
  description?: string;
} | null;

/**
 * Rich embed store
 */
export default class RichEmbedStore {
  constructor(private richEmbedService = sp.resolve('richEmbed')) {}
  @observable hasRichEmbed = false;
  @observable metaInProgress = false;
  @observable meta: MetaType = null;
  richEmbedUrl = '';
  _richEmbedFetchTimer: Timeout | null = null;
  setRichEmbedPromise: Promise<void> | null = null; // used for testing

  /**
   * Richembed check
   */
  @action
  richEmbedCheck = text => {
    const matches = Util.urlReSingle.exec(text);

    if (this._richEmbedFetchTimer) {
      clearTimeout(this._richEmbedFetchTimer);
    }

    if (matches) {
      const url =
        (!(
          matches[0].startsWith('https://') || matches[0].startsWith('http://')
        )
          ? 'https://'
          : '') + matches[0];

      if (
        !this.hasRichEmbed ||
        (this.hasRichEmbed &&
          url.toLowerCase() !== this.richEmbedUrl.toLowerCase())
      ) {
        this._richEmbedFetchTimer = setTimeout(
          () => (this.setRichEmbedPromise = this.setRichEmbed(url)),
          750,
        );
      }
    }
  };

  /**
   * Clear rich embed
   */
  clearRichEmbedAction = () => {
    this.clearRichEmbed();

    if (this._richEmbedFetchTimer) {
      clearTimeout(this._richEmbedFetchTimer);
    }
  };

  /**
   * Clear rich embed
   */
  @action
  clearRichEmbed = () => {
    this.hasRichEmbed = false;
    this.richEmbedUrl = '';
    this.meta = null;
  };

  /**
   * Set metadata
   * @param meta
   */
  @action
  setMeta(meta) {
    this.meta = meta;
    this.hasRichEmbed = Boolean(meta);
  }

  /**
   * Set rich embed
   * @param {string} url
   */
  @action
  async setRichEmbed(url) {
    this.hasRichEmbed = true;
    this.richEmbedUrl = url;
    this.meta = null;
    this.metaInProgress = true;

    try {
      const meta: MetaType = await this.richEmbedService.getMeta(url);
      runInAction(() => {
        this.meta = meta;
        this.metaInProgress = false;
      });
    } catch (e) {
      this.metaInProgress = false;
      sp.log.exception('[RichEmbedStore]', e);
    }
  }
}
