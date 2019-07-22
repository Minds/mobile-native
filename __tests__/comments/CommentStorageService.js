import { CommentStorageService } from '../../src/comments/CommentStorageService';
import sqliteService from '../../src/common/services/sqlite.service';
import sqliteStorageProviderService from '../../src/common/services/sqlite-storage-provider.service';

jest.mock('../../src/common/services/sqlite.service');
jest.mock('../../src/common/services/log.service');

/**
 * Tests
 */
describe('Comment storage service', () => {
  const storage = new CommentStorageService();
  let sql;

  const response = [{
    "data":'{"comments":[{"type":"comment","entity_guid":"988128928149561344","parent_guid_l1":"0","parent_guid_l2":"0","guid":"eyJfdHlwZSI6ImNvbW1lbnQiLCJjaGlsZF9wYXRoIjoiOTg5Njg4NDA0MTEyMDI3NjQ4OjA6MCIsImVudGl0eV9ndWlkIjoiOTg4MTI4OTI4MTQ5NTYxMzQ0IiwiZ3VpZCI6Ijk4OTY4ODQwNDExMjAyNzY0OCIsInBhcmVudF9wYXRoIjoiMDowOjAiLCJwYXJ0aXRpb25fcGF0aCI6IjA6MDowIn0=","replies_count":0,"owner_guid":"781640694769917958","time_created":1561336103,"time_updated":1561336103,"attachments":[],"mature":false,"edited":false,"spam":false,"deleted":false,"_guid":"989688404112027648","partition_path":"0:0:0","parent_path":"0:0:0","child_path":"989688404112027648:0:0","description":"Test","thumbs:up:user_guids":[],"thumbs:up:count":0,"thumbs:down:user_guids":[],"thumbs:down:count":0,"can_reply":true}],"load-previous":"","load-next":"","socketRoomName":"comments:988128928149561344:0:0:0"}'
  }];

  beforeEach(async () => {
    sql = await sqliteStorageProviderService.get();
  });

  it('should return null on error', () => {

    sql.executeSql.mockRejectedValue(Error('Boom'));

    return expect(storage.read('0001', '0:0:0', true, '', '')).resolves.toBe(null);

  });

  it('should return null on empty result', () => {

    const result = {rows: {raw: jest.fn()}};

    result.rows.raw.mockReturnValue(null);

    sql.executeSql.mockResolvedValue([result]);

    return expect(storage.read('0001', '0:0:0', true, '', '')).resolves.toBe(null);

  });

  it('should return null on no data', () => {

    const result = {rows: {raw: jest.fn()}};

    result.rows.raw.mockReturnValue([{}]);

    sql.executeSql.mockResolvedValue([result]);

    return expect(storage.read('0001', '0:0:0', true, '', '')).resolves.toBe(null);

  });

  it('should return stored comments', () => {

    const result = {rows: {raw: jest.fn()}};

    result.rows.raw.mockReturnValue(response);

    sql.executeSql.mockResolvedValue([result]);

    return expect(storage.read('0001', '0:0:0', true, '', '')).resolves.toEqual(JSON.parse(response[0].data));

  });

  it('should insert into comments_feeds', async (done) => {

    sql.init.mockResolvedValue();
    sql.executeSql.mockResolvedValue([true]);

    const result = {comments: []};

    try {
      await storage.write('1234', '0:0:0', true, '1', '0002', result);

      // TODO: check parameters, for some reason jest is transforming the paramters array.
      expect(sql.executeSql).toBeCalled();
      done();
    } catch(err) {
      done.fail();
    }
  });
});