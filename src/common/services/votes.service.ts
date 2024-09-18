import sp from '~/services/serviceProvider';
/**
 * Vote an activity
 * @param {string} guid
 * @param {string} direction up|down
 * @param {*} data extra data
 */
export async function vote(guid, direction, data) {
  const response = await sp.api.put(
    'api/v1/votes/' + guid + '/' + direction,
    data,
  );
  return { data: response };
}
