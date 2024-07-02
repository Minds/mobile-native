const removeFromMobile = ['memberships', 'admin'];

function filterNavigationItems(items) {
  return items.filter(item => !removeFromMobile.includes(item.id));
}

exports.filterNavigationItems = filterNavigationItems;
