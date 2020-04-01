//@ts-nocheck
import { Platform } from "react-native";

import Colors from "../styles/Colors";

export default {
  header: {
    backgroundColor: '#fff',
    paddingTop: Platform.OS == 'ios' ? 14 : 8,
  },
  close: {
    padding: 8,
  },
  view: {
    backgroundColor: '#fff',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 20,
    fontWeight: '300',
    lineHeight: 30,
    textAlign: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  smaller: {
    fontSize: 16,
    lineHeight: 24,
  },
  link: {
    color: Colors.primary
  }
}
