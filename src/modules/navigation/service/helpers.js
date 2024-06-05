const removeFromMobile = ['memberships', 'admin'];

function filterNavigationItems(items) {
  return items.filter(
    item => item.visibleMobile && !removeFromMobile.includes(item.id),
  );
}

exports.filterNavigationItems = filterNavigationItems;
