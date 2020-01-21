/**
 * @author Ben Hayward
 */
import fetch from 'node-fetch';

export default async (username, password) => {
  let params = {
    grant_type: 'password',
    client_id: 'mobile',
    username,
    password,
  };

  try {
    const result = await fetch('https://www.minds.com/api/v2/oauth/token',  {
      method: 'POST',
      body: JSON.stringify(params),
    }).then(res => res.json()); //get the token.

    const result1 = fetch('https://www.minds.com/api/v2/settings/delete',  {
      method: 'POST',
      body: JSON.stringify({password}),
      headers: {Authorization: 'Bearer ' + result.access_token},
    }).then(res => res.json()); //make the deletion request.
    console.log('deleting user returned:\n', await result1);
  } catch (e) {
    console.log('error deleting user:\n', e);
  }
};
