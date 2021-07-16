import React, { useEffect, useState } from 'react';
import styles from './style';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import theme from '../../../resources/theme';
import { useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import { logger } from '../../../utils/common';

const WorkSpaceList = (props) => {
  const workList = useSelector((state) => state.reducer.workSpace);
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

        <ScrollView>
          <View style={styles.bodyContainer}>
            {workList.data.map((item) => {
              const imageName = item.st_name.split(' ');
              return (
                <TouchableOpacity activeOpacity={0.7} style={styles.workBox}>
                  <View style={styles.subBox}>
                    {item.st_featured_image ? (
                      <Image
                        style={styles.imgStyle}
                        source={{ uri: global + item.st_featured_image }}
                      />
                    ) : (
                      <View style={styles.textImage}>
                        <Text style={styles.textStyle}>
                          {imageName[0]?.slice(0, 1) +
                            imageName[1]?.slice(0, 1)}{' '}
                        </Text>
                      </View>
                    )}
                    <View style={styles.textBox}>
                      <Text style={styles.heading}>{item.st_name}</Text>
                      <Text style={styles.textNote}>
                        {item.in_type_id === 2 ? 'Profit' : 'Non-Profit'}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.bottomText}>{item.st_description}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default WorkSpaceList;
