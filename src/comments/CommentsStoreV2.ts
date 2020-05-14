import BaseModel from '../common/BaseModel';
import { postComment } from './CommentsService';
import { UserError } from '../common/UserError';

export const CommentsStoreV2 = () => ({
  guid: null,

  input: '',
  setInput(input) {
    this.input = input;
  },

  attachmentGuid: '',
  setAttachmentGuid(guid) {
    this.attachmentGuid = guid;
  },

  richEmbedMeta: null,
  setRichEmbedMeta(meta) {
    this.richEmbedMeta = meta;
  },

  saving: false,
  async post(entity: BaseModel) {
    this.saving = true;

    // @ts-ignore
    const guid = entity.entity_guid || entity.guid;

    const comment: any = {
      comment: this.input,
      //mature: this.mature,
      parent_path: '0:0:0',
    };

    if (this.attachmentGuid) {
      comment.attachmentGuid = this.attachmentGuid;
    }

    if (this.richEmbedMeta) {
      Object.assign(comment, this.richEmbedMeta);
    }

    // Add client metada if available
    Object.assign(comment, entity.getClientMetadata());

    try {
      <any>await postComment(guid, comment);

      this.setInput('');

      // @ts-ignore
      if (entity.incrementCommentsCounter) {
        // @ts-ignore
        entity.incrementCommentsCounter();
      }
    } catch (err) {
      // logService.exception('[CommentsStore] post', err);
      throw new UserError('Error sending comment');
    } finally {
      this.saving = false;
    }

    return comment;
  },
});

export default CommentsStoreV2;
