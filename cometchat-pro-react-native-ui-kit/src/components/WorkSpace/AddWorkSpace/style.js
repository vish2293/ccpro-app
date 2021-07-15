import { StyleSheet } from 'react-native';
import { widthRatio, heightRatio } from '../../../utils/consts';
import theme from '../../../resources/theme';
export default StyleSheet.create({
  workScreenStyle: {
    flex: 1,
    backgroundColor: '#fff',
    width: '100%',
    color: '#151515',
  },
  mainContainer: {
    marginVertical: 20,
  },
  headingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 22 * heightRatio,
    marginLeft: 7,
  },

  bodyContainer: {
    marginHorizontal: 15,
    marginVertical: 20,
  },

  iconStyle: {
    marginLeft: 16 * widthRatio,
  },
  textInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    paddingLeft: 10,
    borderRadius: 5,
  },
  labelStyle: {
    marginVertical: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginTop: 10,
  },
  pickerInput: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    borderRadius: 5,
  },
  buttonStyle: {
    flexDirection: 'row',
    height: 40,
    width: 120,
    backgroundColor: '#236f91',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    marginLeft: 10,
  },
  uploadImg: {
    height: 100,
    width: 100,
  },
  crossIcon: {
    position: 'absolute',
    zIndex: 1,
    right: -5,
    top: -5,
    backgroundColor: 'gray',
    height: 25,
    width: 25,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
