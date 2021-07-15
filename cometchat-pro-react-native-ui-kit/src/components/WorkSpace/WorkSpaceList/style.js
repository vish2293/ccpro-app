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
  buttonStyle: {
    height: 35,
    width: 85,
    backgroundColor: '#236f91',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bodyContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: 15,
    marginVertical: 20,
    justifyContent: 'space-around',
  },
  workBox: {
    borderWidth: 3,
    borderColor: '#338ce2',
    height: 110,
    width: '46%',
    marginHorizontal: 5,
    marginVertical: 10,
    padding: 7,
    justifyContent: 'center',
    borderRadius: 5,
  },
  imgStyle: {
    height: 40,
    width: 40,
    borderRadius: 100 / 2,
  },
  subBox: {
    flexDirection: 'row',
  },
  textBox: {
    marginLeft: 5,
  },
  heading: {
    color: '#338ce2',
    fontWeight: 'bold',
  },
  textNote: {
    fontSize: 12,
    marginLeft: 2,
  },
  bottomText: {
    marginTop: 10,
  },
  iconStyle: {
    marginLeft: 16 * widthRatio,
  },
  textImage: {
    backgroundColor: '#D3D3D3',
    borderRadius: 100 / 2,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 13,
    fontWeight: 'bold',
  },
});
