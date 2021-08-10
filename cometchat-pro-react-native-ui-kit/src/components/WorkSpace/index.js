import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import style from './style';
import { heightRatio } from '../../utils/consts';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import { selectWorkSpace } from '../../../../store/action';
import Popover from 'react-native-popover-view';
import OfflineNotice from '../../../../OfflineNotice';

const data = ['sms', 'calendar-today', 'more-horiz'];

export default function WorkSpace(props) {
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
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

  const onChangeHandler = (val) => {
    setSearch(val);
  };

  let filteredSpaces = workList?.data?.filter((work) => {
    return work.st_name?.toLowerCase().indexOf(search.toLowerCase()) !== -1;
  });

  return (
    <SafeAreaView style={style.safeArea}>
      <View style={style.container}>
        <View style={[style.moreBox, { marginRight: 10, marginLeft: 0 }]}>
          <Ionicons name="chatbox-outline" size={18} color="#fff" />
        </View>
        {workList?.data &&
          workList.data.slice(0, 4).map((item, index) => {
            return (
              <TouchableOpacity
                key={index}
                onPress={() => onTab(item)}
                style={style.boxStyle}>
                {item.st_featured_image ? (
                  <Image
                    style={
                      item.st_guid === getSelectedSpace?.st_guid
                        ? style.imgBorderStyle
                        : style.imgStyle
                    }
                    source={{ uri: global + item.st_featured_image }}
                  />
                ) : (
                  <View
                    style={
                      item.st_guid === getSelectedSpace?.st_guid
                        ? style.textBoxBordered
                        : style.textBox
                    }>
                    <Text style={style.textStyle}>
                      {`${item.st_name.slice(0, 1)} ${item.in_workspace_id}`}
                    </Text>
                  </View>
                )}
                {/* <MaterialIcons name={a} size={25 * heightRatio} color={'grey'} /> */}
              </TouchableOpacity>
            );
          })}
        <Popover
          popoverStyle={style.popStyle}
          from={
            <TouchableOpacity style={style.moreBox}>
              <Feather name="more-horizontal" size={20} color="#fff" />
            </TouchableOpacity>
          }>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ padding: 15 }}>
              <Text style={style.swictherHeading}>Switch Workspaces</Text>
              <TextInput
                value={search}
                style={style.searchInput}
                placeholder="Search for Workspaces"
                onChangeText={onChangeHandler}
              />
              <Text style={style.subHeading}>Pinned Workspaces</Text>

              <View style={style.workspaceRow}>
                {workList?.data &&
                  filteredSpaces.map((item, index) => {
                    if (item.in_pinned === 1) {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => onTab(item)}
                          style={style.workspaceCircle}>
                          {item.st_featured_image ? (
                            <View style={style.whiteBorder}>
                              <Image
                                style={
                                  item.st_guid === getSelectedSpace?.st_guid
                                    ? style.imgBorderStyle
                                    : style.imgStyle
                                }
                                source={{
                                  uri: global + item.st_featured_image,
                                }}
                              />
                            </View>
                          ) : (
                            <View style={style.whiteBorder}>
                              <View
                                style={
                                  item.st_guid === getSelectedSpace?.st_guid
                                    ? style.textBoxBordered
                                    : style.textBox
                                }>
                                <Text style={style.textStyle}>
                                  {`${item.st_name.slice(0, 1)} ${
                                    item.in_workspace_id
                                  }`}
                                </Text>
                              </View>
                            </View>
                          )}
                          {/* <MaterialIcons name={a} size={25 * heightRatio} color={'grey'} /> */}
                        </TouchableOpacity>
                      );
                    }
                  })}
              </View>

              <Text style={style.subHeading}>Other Workspaces</Text>
              <View style={style.workspaceRow}>
                {workList?.data &&
                  filteredSpaces.map((item, index) => {
                    if (item.in_pinned === 0) {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => onTab(item)}
                          style={style.workspaceCircle}>
                          {item.st_featured_image ? (
                            <View style={style.whiteBorder}>
                              <Image
                                style={
                                  item.st_guid === getSelectedSpace?.st_guid
                                    ? style.imgBorderStyle
                                    : style.imgStyle
                                }
                                source={{
                                  uri: global + item.st_featured_image,
                                }}
                              />
                            </View>
                          ) : (
                            <View style={style.whiteBorder}>
                              <View
                                style={
                                  item.st_guid === getSelectedSpace?.st_guid
                                    ? style.textBoxBordered
                                    : style.textBox
                                }>
                                <Text style={style.textStyle}>
                                  {`${item.st_name.slice(0, 1)} ${
                                    item.in_workspace_id
                                  }`}
                                </Text>
                              </View>
                            </View>
                          )}
                          {/* <MaterialIcons name={a} size={25 * heightRatio} color={'grey'} /> */}
                        </TouchableOpacity>
                      );
                    }
                  })}
                {filteredSpaces.length === 0 && search !== '' ? (
                  <View>
                    <Text style={{ color: 'gray' }}>No result found</Text>
                  </View>
                ) : null}
              </View>
            </View>
          </ScrollView>
        </Popover>
      </View>
    </SafeAreaView>
  );
}
