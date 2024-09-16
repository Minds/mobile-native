const { TENANT_IS_NON_PROFIT } = require('~/config/Config');

const removeFromMobile = TENANT_IS_NON_PROFIT
  ? ['admin']
  : ['memberships', 'admin'];

function filterNavigationItems(items) {
  return items.filter(item => !removeFromMobile.includes(item.id));
}

exports.filterNavigationItems = filterNavigationItems;
