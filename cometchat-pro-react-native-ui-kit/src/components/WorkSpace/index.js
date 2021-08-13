import React, { useEffect, useState, Fragment, useRef } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  Image,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import style from './style';
import { heightRatio } from '../../utils/consts';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectWorkSpace,
  onPinnedWorkspace,
  onUnPinnedWorkspace,
} from '../../../../store/action';
import Popover from 'react-native-popover-view';
import OfflineNotice from '../../../../OfflineNotice';

const data = ['sms', 'calendar-today', 'more-horiz'];

export default function WorkSpace(props) {
  const touchable = useRef();
  const workList = useSelector((state) => state.reducer.workSpace);
  const dispatch = useDispatch();
  const [search, setSearch] = useState('');
  const [itemIndex, setIndex] = useState(-1);
  const [pinnedIndex, setPinnedIndex] = useState(-1);
  const getSelectedSpace = useSelector(
    (state) => state.reducer.selectedWorkSpace,
  );
  const uid = useSelector((state) => state.reducer.user.uid);

  useEffect(() => {
    console.log('slected:', getSelectedSpace);
  }, [getSelectedSpace]);

  // const { workList } = props;
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

  const showMenu = (index) => {
    setIndex(index);
  };

  const closeMenu = () => {
    setIndex(-1);
    setPinnedIndex(-1);
  };

  const showPinnedMenu = (index) => {
    setPinnedIndex(index);
  };

  const onTapPinned = async (workspace) => {
    if (filteredSpaces.filter((a) => a.in_pinned === 1).length < 2) {
      console.log('workspace:', workspace);
      console.log('uid', uid);
      const data = {
        user_id: uid,
        ws_pinned: [workspace.st_guid],
      };
      await dispatch(onPinnedWorkspace(data));
      setIndex(-1);
    } else {
      setIndex(-1);
      Alert.alert('', 'User can only pinned 2 workspaces!', [
        { text: 'ok', onPress: () => {} },
      ]);
    }
  };

  const onTapUnPinned = async (workspace) => {
    console.log('workspace:', workspace);
    console.log('uid', uid);
    const data = {
      user_id: uid,
      ws_unpinned: [workspace.st_guid],
    };
    await dispatch(onUnPinnedWorkspace(data));
    setPinnedIndex(-1);
  };

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
            <TouchableOpacity
              activeOpacity={1}
              onPress={closeMenu}
              style={{ padding: 15 }}>
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
                        <View
                          key={index}
                          onPress={() => onTab(item)}
                          style={style.workspaceCircle}>
                          {item.st_featured_image ? (
                            <TouchableOpacity
                              onLongPress={() => showPinnedMenu(index)}
                              onPress={() => onTab(item)}
                              style={style.whiteBorder}>
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
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onLongPress={() => showPinnedMenu(index)}
                              onPress={() => onTab(item)}
                              style={style.whiteBorder}>
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
                            </TouchableOpacity>
                          )}

                          <View>
                            <Text style={{ fontSize: 12 }}>
                              {item.st_name.length > 12
                                ? `${item.st_name.slice(0, 12)}..`
                                : item.st_name}
                            </Text>
                          </View>

                          {index === pinnedIndex ? (
                            <TouchableOpacity
                              onPress={() => onTapUnPinned(item)}
                              style={{
                                position: 'absolute',
                                elevation: 5,
                                top: 35,
                                backgroundColor: '#fff',
                                paddingVertical: 4,
                                paddingHorizontal: 10,
                                zIndex: 2,
                                borderRadius: 3,
                              }}>
                              <Text>unPin</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      );
                    }
                  })}

                {filteredSpaces?.length === 0 && search !== '' ? (
                  <View style={{ marginBottom: 10 }}>
                    <Text style={{ color: 'gray' }}>No result found</Text>
                  </View>
                ) : null}
              </View>

              <Text style={style.subHeading}>Other Workspaces</Text>
              <View style={style.workspaceRow}>
                {workList?.data &&
                  filteredSpaces.map((item, index) => {
                    if (item.in_pinned === 0) {
                      return (
                        <View key={index} style={style.workspaceCircle}>
                          {item.st_featured_image ? (
                            <TouchableOpacity
                              onLongPress={() => showMenu(index)}
                              onPress={() => onTab(item)}
                              style={style.whiteBorder}>
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
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity
                              onLongPress={() => showMenu(index)}
                              onPress={() => onTab(item)}
                              style={style.whiteBorder}>
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
                            </TouchableOpacity>
                          )}
                          <View>
                            <Text style={{ fontSize: 12 }}>
                              {item.st_name.length > 12
                                ? `${item.st_name.slice(0, 12)}..`
                                : item.st_name}
                            </Text>
                          </View>

                          {index === itemIndex ? (
                            <TouchableOpacity
                              onPress={() => onTapPinned(item)}
                              style={style.pinView}>
                              <Text>Pin</Text>
                            </TouchableOpacity>
                          ) : null}
                        </View>
                      );
                    }
                  })}
                {filteredSpaces?.length === 0 && search !== '' ? (
                  <View>
                    <Text style={{ color: 'gray' }}>No result found</Text>
                  </View>
                ) : null}
              </View>
            </TouchableOpacity>
          </ScrollView>
        </Popover>
      </View>
    </SafeAreaView>
  );
}
