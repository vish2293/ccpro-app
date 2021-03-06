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
    backgroundColor: '#fff',
    height: 350,
    width: '90%',
    borderRadius: 5,
    left: -5,
  },
  popRoleStyle: {
    backgroundColor: '#fff',
    height: 290,
    width: '90%',
    borderRadius: 5,
  },
  whiteBorder: {
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 100 / 2,
  },
  swictherHeading: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchInput: {
    backgroundColor: '#f6f6f6',
    height: 45,
    marginVertical: 10,
    paddingLeft: 10,
  },
  workspaceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    // justifyContent: 'center',
  },
  workspaceCircle: {
    width: '33%',
    alignItems: 'center',
    marginVertical: 7,
  },
  subHeading: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  pinView: {
    position: 'absolute',
    elevation: 5,
    top: 35,
    backgroundColor: '#fff',
    paddingVertical: 4,
    paddingHorizontal: 20,
    zIndex: 2,
    borderRadius: 3,
  },
  workspaceRowRole: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    // justifyContent: 'center',
  },
  subHeadingRole: {
    fontSize: 14,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  imgRoleStyle: {
    height: 45,
    width: 45,
    borderRadius: 100 / 2,
  },
  roleText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  labelText: {
    fontStyle: 'italic',
    fontWeight: 'normal',
    color: '#7f7f7f',
  },
  noteText: {
    fontWeight: 'normal',
    color: '#7f7f7f',
  },
  redCircle: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: 'red',
    height: 17,
    width: 17,
    borderRadius: 100 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notiText: {
    color: '#fff',
    fontSize: 10,
  },
});
