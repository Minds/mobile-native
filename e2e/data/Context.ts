export const context = {
  logins: {
    'banned channel': {
      username: 'test_banned_user',
      password: process.env.E2E_COMMON_PASSWORD,
    },
    'deleted channel': {
      username: 'test_deleted_user',
      password: process.env.E2E_COMMON_PASSWORD,
    },
    'valid channel': {
      username: process.env.E2E_USERNAME,
      password: process.env.E2E_PASSWORD,
    },
  },
};
