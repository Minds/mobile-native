import { registerRootComponent } from 'expo';

import PreviewApp from './PreviewApp';
import { enableFreeze } from 'react-native-screens';

enableFreeze(true);

registerRootComponent(PreviewApp);
