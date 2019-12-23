/**
 * @author Ben Hayward
 */
import fetch from 'node-fetch';

export default async (username, password, email) => {
  const params = {
    username: username,
    password: password,
    password2: password,
    email: email,
    Homepage121118: null,
    captcha: "",
    exclusive_promotions: false,
    tos: true
  };

  await fetch('https://www.minds.com/api/v1/register', {
    method: 'POST',
    body: JSON.stringify(params)
  })
    .then(result => result.json())
    .then(result => {
      console.log(
        `new user - ${process.env.newUsername} created: ${JSON.stringify(
          result.status,
        )}`,
      );
    });
};

