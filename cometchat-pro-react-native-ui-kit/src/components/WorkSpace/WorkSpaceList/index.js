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

const WorkSpaceList = (props) => {
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(getAllWorkSpaces());
  }, []);
  const isLoading = useSelector((state) => state.reducer.loader);
  const workList = useSelector((state) => state.reducer.allWorkspaces);
  const global = workList?.globals?.ws_upload_url
    ? workList.globals.ws_upload_url
    : '';

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
    navigation.navigate('AddWorkSpace');
  };

  return (
    <SafeAreaView style={styles.workScreenStyle}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={goBack} style={styles.iconStyle}>
            <Icon name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitleStyle}>Workspace</Text>
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
              {workList?.data?.map((item, index) => {
                return (
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={styles.workBox}
                    key={index}>
                    <View style={styles.subBox}>
                      {item.st_featured_image ? (
                        <Image
                          style={styles.imgStyle}
                          source={{ uri: global + item.st_featured_image }}
                        />
                      ) : (
                        <View style={styles.textImage}>
                          <Text style={styles.textStyle}>
                            {`${item.st_name.slice(0, 1)} ${
                              item.in_workspace_id
                            }`}
                          </Text>
                        </View>
                      )}
                      <View style={styles.textBox}>
                        <Text
                          ellipsizeMode="tail"
                          numberOfLines={1}
                          style={styles.heading}>
                          {item.st_name}
                        </Text>
                        <Text style={styles.textNote}>
                          {item.in_type_id === 2 ? 'Profit' : 'Non-Profit'}
                        </Text>
                      </View>
                    </View>
                    <Text
                      ellipsizeMode="tail"
                      numberOfLines={2}
                      style={styles.bottomText}>
                      {item.st_description}
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
export default WorkSpaceList;
