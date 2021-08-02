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
import { getAllWorkSpaces } from '../../../../../store/action';
import { GroupListManager } from './controller';

const GroupsList = (props) => {
  const dispatch = useDispatch();
  const [groupsData, setGroups] = useState([]);
  const [isEmpty, setEmpty] = useState('');
  useLayoutEffect(() => {
    // dispatch(getAllWorkSpaces());
    getGroups();
  }, []);
  const isLoading = useSelector((state) => state.reducer.loader);
  const workList = useSelector((state) => state.reducer.allWorkspaces);
  const selectedWorkspace = useSelector(
    (state) => state.reducer.selectedWorkSpace,
  );
  const global = workList?.globals?.ws_upload_url
    ? workList.globals.ws_upload_url
    : '';
  console.log('worklist::::', selectedWorkspace);
  /**
   * Retrieve logged in user details
   * @param
   */

  const getGroups = () => {
    let val = '-group-';

    const GroupListManagerObject = new GroupListManager(val);
    console.log(GroupListManagerObject);

    GroupListManagerObject.fetchNextGroups()
      .then((allTeamgroupList) => {
        console.log('groupsss::', allTeamgroupList);
        setGroups(allTeamgroupList);

        // if (allTeamgroupList.length === 0) {
        //   console.log('groupsss::', allTeamgroupList);
        // } else {
        //   setEmpty('No Groups Found!');
        // }
      })
      .catch(
        (error) => console.log('error in groups::', error),
        // this.setState({
        //   decoratorMessage: 'Something went wrong!',
        // }),
      );
  };

  const goBack = () => {
    const { navigation } = props;
    navigation.goBack();
  };

  const goToAdd = (item = false, image = false) => {
    const { navigation } = props;
    console.log('item', item);
    navigation.navigate('AddGroups', { data: item, image: image });
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

        {isLoading ? (
          <View style={styles.loadingView}>
            <ActivityIndicator color="#338ce2" size="large" />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.bodyContainer}>
              {groupsData?.map((item, index) => {
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
                      {item.description.length > 10
                        ? item.description.slice(0, 12)
                        : item.description}
                    </Text>
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
export default GroupsList;
