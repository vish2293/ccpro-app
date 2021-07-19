import React, { useLayoutEffect, useState, useEffect } from 'react';
import styles from './style';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import theme from '../../../resources/theme';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { logger } from '../../../utils/common';
import { getAllWorkSpaces, onGetAllTeams } from '../../../../../store/action';
import { GroupListManager } from '../CometChatTeamList/controller';

const TeamList = (props) => {
  const isLoading = useSelector((state) => state.reducer.loader);
  const workList = useSelector((state) => state.reducer.allWorkspaces);
  const getAllTeams = useSelector((state) => state.reducer.allTeamsList);
  const global = workList?.globals?.ws_upload_url
    ? workList.globals.ws_upload_url
    : '';
  const dispatch = useDispatch();

  const getTeams = async () => {
    const copyList = [];
    console.log('work list:', workList);

    const workdata = workList.data;

    for (var i = 0; i < workdata.length; i++) {
      console.log('work id:', workdata[i].st_guid);

      let val = `${workList.data[0]?.st_guid}-team-`;
      console.log('value::', val);
      const GroupListManagerObject = new GroupListManager(val);
      GroupListManagerObject.fetchNextGroups().then((groupList) => {
        console.log('groupsss:::', groupList);

        if (groupList.length === 0) {
        } else {
          for (var a = 0; a < groupList.length; a++) {
            copyList.push(groupList[a]);
          }
          console.log('copy List', copyList);
          dispatch(onGetAllTeams(copyList));
        }
      });
    }
  };

  useLayoutEffect(() => {
    if (workList?.data && workList.data.length === 0) {
      dispatch(getAllWorkSpaces());
    }
  }, []);

  useEffect(() => {
    getTeams();
  }, [workList]);

  /**
   * Retrieve logged in user details
   * @param
   */

  const goBack = () => {
    const { navigation } = props;
    navigation.goBack();
  };

  const goToAdd = () => {
    const { navigation } = props;
    navigation.navigate('AddTeam');
  };

  return (
    <SafeAreaView style={styles.workScreenStyle}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={goBack} style={styles.iconStyle}>
            <Icon name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitleStyle}>Teams</Text>
          <TouchableOpacity
            onPress={goToAdd}
            activeOpacity={0.8}
            style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator color="#338ce2" size="large" />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.bodyContainer}>
              {getAllTeams?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.workBox}
                    key={index}>
                    <View style={styles.subBox}>
                      {item.icon ? (
                        <Image
                          style={styles.imgStyle}
                          source={{ uri: item.icon }}
                        />
                      ) : (
                        <View style={styles.textImage}>
                          <Text style={styles.textStyle}>
                            {item?.name?.slice(0, 2)}
                          </Text>
                        </View>
                      )}
                      <View style={styles.textBox}>
                        <Text style={styles.heading}>
                          {item?.name?.length > 10
                            ? `${item?.name?.slice(0, 12)}..`
                            : item.name}
                        </Text>
                        <Text style={styles.textNote}>{item.name}</Text>
                      </View>
                    </View>
                    <Text style={styles.bottomText}>{item.description}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
export default TeamList;
