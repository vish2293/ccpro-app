import React, { PureComponent } from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import NetInfo from '@react-native-community/netinfo';

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

let unsubscribe;

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true,
  };

  componentDidMount() {
    unsubscribe = NetInfo.addEventListener((state) => {
      console.log('Is connected?', state.isConnected);
      this.handleConnectivityChange(state.isConnected);
    });
  }

  componentWillUnmount() {
    unsubscribe();
  }

  handleConnectivityChange = (isConnected) => {
    this.setState({ isConnected });
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: '#b52424',
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    width,
    // position: 'absolute',
    // top: 100,
    zIndex: 1000,
  },
  offlineText: { color: '#fff' },
});

export default OfflineNotice;
