import React, { useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import style from './style';
import { heightRatio } from '../../utils/consts';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { selectWorkSpace } from '../../../../store/action';

const data = ['sms', 'calendar-today', 'more-horiz'];

export default function WorkSpace(props) {
  const dispatch = useDispatch();
  const getSelectedSpace = useSelector(
    (state) => state.reducer.selectedWorkSpace,
  );

  useEffect(() => {
    console.log('slected:', getSelectedSpace);
  }, [getSelectedSpace]);

  const { workList } = props;
  const global = workList?.globals?.ws_upload_url
    ? workList.globals.ws_upload_url
    : '';

  const onTab = (workspace) => {
    console.log('tab', workspace);
    dispatch(selectWorkSpace(workspace));
  };

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {workList?.data &&
            workList.data.map((item) => {
              const imageName = item.st_name.split(' ');
              return (
                <TouchableOpacity
                  onPress={() => onTab(item)}
                  style={style.boxStyle}>
                  {item.st_featured_image ? (
                    <Image
                      style={
                        item.st_guid === getSelectedSpace.st_guid
                          ? style.imgBorderStyle
                          : style.imgStyle
                      }
                      source={{ uri: global + item.st_featured_image }}
                    />
                  ) : (
                    <View
                      style={
                        item.st_guid === getSelectedSpace.st_guid
                          ? style.textBoxBordered
                          : style.textBox
                      }>
                      <Text style={style.textStyle}>
                        {imageName[0].slice(0, 1) + imageName[1].slice(0, 1)}{' '}
                      </Text>
                    </View>
                  )}
                  {/* <MaterialIcons name={a} size={25 * heightRatio} color={'grey'} /> */}
                </TouchableOpacity>
              );
            })}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
