import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';

export default function UserSuggestions(props) {
  console.log('memmmmm', props.memberName);
  return (
    <View style={styles.container}>
      <ScrollView keyboardShouldPersistTaps={'always'}>
        {props.memberList.map((mem) => {
          if (props.memberName === '' || mem.name.includes(props.memberName))
            return (
              <TouchableOpacity
                key={mem.uid}
                onPress={() => {
                  props.tagMember(mem.name);
                }}
                style={styles.options}>
                <Image
                  source={{ uri: mem.avatar }}
                  style={{
                    height: 40,
                    width: 40,
                    backgroundColor: 'rgba(255,255,255,0.7)',
                    borderRadius: 100,
                  }}
                />
                <Text style={styles.optionText}>{mem.name}</Text>
              </TouchableOpacity>
            );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    zIndex: 1000,
    bottom: '100%',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,

    elevation: 5,
  },
  options: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    fontWeight: '800',
    marginLeft: 10,
  },
});
