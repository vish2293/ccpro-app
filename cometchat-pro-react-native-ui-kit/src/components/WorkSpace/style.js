const { StyleSheet } = require('react-native');

module.exports = StyleSheet.create({
  safeArea: {
    backgroundColor: 'white',
    zIndex: 1000,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    justifyContent: 'center',
  },
  boxStyle: {
    padding: 10,
    alignItems: 'center',
  },
  imgStyle: {
    height: 35,
    width: 35,
    borderRadius: 100 / 2,
  },
  textBox: {
    backgroundColor: '#D3D3D3',
    borderRadius: 100 / 2,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 11,
  },
  textBoxBordered: {
    backgroundColor: '#D3D3D3',
    borderRadius: 100 / 2,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#3498fb',
  },
  imgBorderStyle: {
    height: 35,
    width: 35,
    borderRadius: 100 / 2,
    borderWidth: 2,
    borderColor: '#3498fb',
  },
  moreBox: {
    backgroundColor: '#3498fb',
    borderRadius: 100 / 2,
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
    marginVertical: 10,
  },
  popStyle: {
    backgroundColor: 'transparent',
    height: 300,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  whiteBorder: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 100 / 2,
  },
});
