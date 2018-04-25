import {
  addNavigationHelpers,
} from 'react-navigation';

import stores from './AppStores';
import Stack from './AppScreens';
import NavigatorStore from './src/common/stores/NavigationStore';
import NavigationStoreService from './src/common/services/navigation.service';

// build navigation store
stores.navigatorStore = new NavigatorStore(Stack);

// Setup navigation store proxy (to avoid circular references issues)
NavigationStoreService.set(stores.navigatorStore);

/**
 * App navigation
 */
class AppNavigation {

  buildNavigator() {
    return addNavigationHelpers({
      dispatch: stores.navigatorStore.dispatch,
      state: stores.navigatorStore.navigationState,
      addListener: () => { }
    });
  }
}

export default new AppNavigation();