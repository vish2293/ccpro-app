import React, { useLayoutEffect, useState } from 'react';
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
import { getAllWorkSpaces, onGetGroups } from '../../../../../store/action';
import { GroupListManager } from './controller';

const GroupsList = (props) => {
  const dispatch = useDispatch();
  const [groupsData, setGroups] = useState([]);
  const [loader, setLoader] = useState(true);
  useLayoutEffect(() => {
    // dispatch(getAllWorkSpaces());
    getGroups();
  }, []);
  const isLoading = useSelector((state) => state.reducer.loader);
  const groupsList = useSelector((state) => state.reducer.groupList);
  const selectedWorkspace = useSelector(
    (state) => state.reducer.selectedWorkSpace,
  );

  console.log('worklist::::', selectedWorkspace);
  /**
   * Retrieve logged in user details
   * @param
   */

  const getGroups = () => {
    let val = `-group-`;
    let copyGroups = [];
    const GroupListManagerObject = new GroupListManager(val);
    console.log(GroupListManagerObject);

    GroupListManagerObject.fetchNextGroups()
      .then((allTeamgroupList) => {
        setLoader(false);
        console.log('groupsss::', allTeamgroupList);
        for (var i = 0; i < allTeamgroupList.length; i++) {
          let guids = allTeamgroupList[i].guid;
          let workId = guids.split('teamgroup');
          if (workId[0] === `${selectedWorkspace.st_guid}-`) {
            console.log('now check:::', allTeamgroupList[i]);
            copyGroups.push(allTeamgroupList[i]);
          }
        }
        // setGroups(copyGroups);
        dispatch(onGetGroups(copyGroups));

        // if (allTeamgroupList.length === 0) {
        //   console.log('groupsss::', allTeamgroupList);
        // } else {
        //   setEmpty('No Groups Found!');
        // }
      })
      .catch(
        (error) => {
          setLoader(false);
          console.log('error in groups::', error);
        },
        // this.setState({
        //   decoratorMessage: 'Something went wrong!',
        // }),
      );
  };

  const goBack = () => {
    const { navigation } = props;
    navigation.goBack();
  };

  const goToAdd = (item = false) => {
    const { navigation } = props;
    console.log('item', item);
    navigation.navigate('AddGroups', { data: item });
  };

  return (
    <SafeAreaView style={styles.workScreenStyle}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={goBack} style={styles.iconStyle}>
            <Icon name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitleStyle}>Groups</Text>
          <TouchableOpacity
            onPress={() => goToAdd()}
            activeOpacity={0.8}
            style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {loader ? (
          <View style={styles.loadingView}>
            <ActivityIndicator color="#338ce2" size="large" />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.bodyContainer}>
              {groupsList?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => goToAdd(item)}
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
                            {`${selectedWorkspace.st_name.slice(0, 1)} ${
                              selectedWorkspace.in_workspace_id
                            }`}
                          </Text>
                        </View>
                      )}
                      <View style={styles.textBox}>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={styles.heading}>
                          {item.name}
                        </Text>
                        <Text style={styles.textNote}>
                          {selectedWorkspace.st_name}
                        </Text>
                      </View>
                    </View>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={2}
                      style={styles.bottomText}>
                      {item.description.length > 15
                        ? `${item.description.slice(0, 15)}..`
                        : item.description}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {groupsList?.length === 0 ? (
                <View style={styles.emptyView}>
                  <Text style={styles.emptyText}>No Groups Found!</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
export default GroupsList;
