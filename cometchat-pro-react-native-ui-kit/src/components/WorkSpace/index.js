import React from 'react';
import { View, Text, SafeAreaView, Image, ScrollView } from 'react-native';
import style from './style';
import { heightRatio } from '../../utils/consts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const data = ['sms', 'calendar-today', 'more-horiz'];

export default function WorkSpace(props) {
  console.log('check props:', props.workList);
  console.log('check global:', props.workList.globals.ws_upload_url);
  const { workList } = props;
  const global = workList.globals.ws_upload_url;
  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {workList.data.map((item) => {
            const imageName = item.st_name.split(' ');
            console.log('splitted:', imageName);
            return (
              <View style={style.boxStyle}>
                {item.st_featured_image ? (
                  <Image
                    style={style.imgStyle}
                    source={{ uri: global + item.st_featured_image }}
                  />
                ) : (
                  <View style={style.textBox}>
                    <Text style={style.textStyle}>
                      {imageName[0].slice(0, 1) + imageName[1].slice(0, 1)}{' '}
                    </Text>
                  </View>
                )}
                {/* <MaterialIcons name={a} size={25 * heightRatio} color={'grey'} /> */}
              </View>
            );
          })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
