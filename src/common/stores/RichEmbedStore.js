import { observable, action, extendObservable } from 'mobx'
import RichEmbedService from '../services/rich-embed.service';
import Util from '../helpers/util';
import logService from '../services/log.service';

/**
 * Rich embed store
 */
export default class RichEmbedStore {
  @observable hasRichEmbed = false;
  @observable metaInProgress = false;
  @observable meta = null;
  richEmbedUrl = '';
  _richEmbedFetchTimer = null;
  setRichEmbedPromise = null; // used for testing

  /**
   * Richembed check
   */
  @action
  richEmbedCheck = (text) => {
    const matches = Util.urlReSingle.exec(text);

    if (this._richEmbedFetchTimer) {
      clearTimeout(this._richEmbedFetchTimer);
    }

    if (matches) {
      const url = (!(matches[0].startsWith('https://') || matches[0].startsWith('http://')) ? 'https://' : '') + matches[0];

      if (
        !this.hasRichEmbed ||
        (this.hasRichEmbed && url.toLowerCase() !== this.richEmbedUrl.toLowerCase())
      ) {
        this._richEmbedFetchTimer = setTimeout(() => this.setRichEmbedPromise = this.setRichEmbed(url), 750);
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
  clearRichEmbed() {
    this.hasRichEmbed = false;
    this.richEmbedUrl = '';
    this.meta = null;
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
      const meta = await RichEmbedService.getMeta(url);
      this.meta = meta;
      this.metaInProgress = false;
    } catch (e) {
      this.metaInProgress = false;
      logService.exception('[RichEmbedStore]', e);
    }
  }

}