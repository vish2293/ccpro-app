import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import style from './style';
import { heightRatio } from '../../utils/consts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const data = ['sms', 'calendar-today', 'more-horiz'];

export default function WorkSpace() {
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        {data.map((a) => {
          return (
            <View style={{ padding: 10 }}>
              <MaterialIcons name={a} size={25 * heightRatio} color={'grey'} />
            </View>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
