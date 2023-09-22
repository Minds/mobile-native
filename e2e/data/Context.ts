export const context = {
  logins: {
    banned: {
      username: 'test_banned_user',
      password: process.env.E2E_COMMON_PASSWORD,
    },
    deleted: {
      username: 'test_deleted_user',
      password: process.env.E2E_COMMON_PASSWORD,
    },
    valid: {
      username: process.env.E2E_USERNAME,
      password: process.env.E2E_PASSWORD,
    },
    'another valid': {
      username: process.env.E2E_USERNAME2,
      password: process.env.E2E_PASSWORD2,
    },
  },
};
