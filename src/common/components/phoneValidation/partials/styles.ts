import { StyleSheet } from 'react-native';

export const style = StyleSheet.create({
  view: {
    backgroundColor: '#fff',
    flex: 1,
    padding: 10,
  },
  cols: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'stretch',
  },
  col: {
    flexBasis: 0,
    flexGrow: 1,
    marginLeft: 10,
  },
  colFirst: {
    marginLeft: 0,
  },
  form: {
    marginTop: 20,
  },
  phoneInput: {
    borderWidth: 1,
    borderRadius: 3,
    paddingLeft: 10,
    paddingRight: 10,
  },
  phoneTextInput: {
    fontSize: 16,
    fontWeight: '700',
  },
});
