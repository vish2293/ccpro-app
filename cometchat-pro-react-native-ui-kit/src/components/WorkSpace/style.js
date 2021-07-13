const { StyleSheet } = require('react-native');

module.exports = StyleSheet.create({
  safeArea: {
    width: 60,
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
    flex: 1,
    alignItems: 'center',
  },
  boxStyle: {
    padding: 10,
    alignItems: 'center',
  },
  imgStyle: {
    height: 25,
    width: 25,
    borderRadius: 5,
  },
  textBox: {
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    height: 25,
    width: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textStyle: {
    fontSize: 11,
  },
});
