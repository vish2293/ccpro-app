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
import { CometChat } from '@cometchat-pro/react-native-chat';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { logger } from '../../../utils/common';
import {
  getAllWorkSpaces,
  onGetAllTeams,
  getUsersList,
} from '../../../../../store/action';

const UsersList = (props) => {
  const usersData = useSelector((state) => state.reducer.usersList);
  const [isLoader, setLoader] = useState(false);

  const userInfo = useSelector((state) => state.reducer.user);

  const dispatch = useDispatch();

  const getUsers = async () => {
    setLoader(true);
    var limit = 30;
    var usersRequest = new CometChat.UsersRequestBuilder()
      .setLimit(limit)
      .build();

    usersRequest.fetchNext().then(
      (userList) => {
        /* userList will be the list of User class. */
        console.log('User list received:', userList);
        dispatch(getUsersList(userList));
        setLoader(false);
        /* retrived list can be used to display contact list. */
      },
      (error) => {
        setLoader(false);
        console.log('User list fetching failed with error:', error);
      },
    );
  };

  useEffect(() => {
    getUsers();
  }, []);

  /**
   * Retrieve logged in user details
   * @param
   */

  const goBack = () => {
    const { navigation } = props;
    navigation.goBack();
  };

  const goToAdd = (item) => {
    const { navigation } = props;
    navigation.navigate('AddUsers', { data: item });
  };

  return (
    <SafeAreaView style={styles.workScreenStyle}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={goBack} style={styles.iconStyle}>
            <Icon name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitleStyle}>Users</Text>
          <TouchableOpacity
            onPress={() => goToAdd(false)}
            activeOpacity={0.8}
            style={styles.buttonStyle}>
            <Text style={styles.buttonText}>Add New</Text>
          </TouchableOpacity>
        </View>

        {isLoader ? (
          <View style={styles.loadingView}>
            <ActivityIndicator color="#338ce2" size="large" />
          </View>
        ) : (
          <ScrollView>
            <View style={styles.bodyContainer}>
              {usersData?.map((item, index) => {
                return (
                  <TouchableOpacity
                    onPress={() => goToAdd(item)}
                    activeOpacity={0.7}
                    style={styles.workBox}
                    key={index}>
                    <View style={styles.subBox}>
                      {item.avatar ? (
                        <Image
                          style={styles.imgStyle}
                          source={{ uri: item.avatar }}
                        />
                      ) : (
                        <View style={styles.textImage}>
                          <Text style={styles.textStyle}>
                            {item?.name?.slice(0, 2)}
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
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={styles.textNote}>
                          {item.name}
                        </Text>
                      </View>
                    </View>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={2}
                      style={styles.bottomText}>
                      {item.role}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              {usersData?.length === 0 ? (
                <View>
                  <Text style={styles.noUserText}>No users found!</Text>
                </View>
              ) : null}
            </View>
          </ScrollView>
        )}
      </View>
    </SafeAreaView>
  );
};
export default UsersList;
