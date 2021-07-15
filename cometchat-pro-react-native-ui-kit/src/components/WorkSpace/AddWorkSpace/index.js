import React, { useEffect, useState } from 'react';
import styles from './style';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import theme from '../../../resources/theme';
import { useSelector } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import { logger } from '../../../utils/common';
// import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';

const AddWorkSpace = (props) => {
  const [workspaceType, setType] = useState('');
  /**
   * Retrieve logged in user details
   * @param
   */

  const goBack = () => {
    const { navigation } = props;
    navigation.goBack();
  };

  const openPicker = () => {
    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true,
    }).then((image) => {
      console.log('pics:', image);
      // ImagePicker.openCropper({
      //   path: 'my-file-path.jpg',
      //   width: 300,
      //   height: 400,
      // }).then((image) => {
      //   console.log('pciker', image);
      // });
    });
  };

  return (
    <SafeAreaView style={styles.workScreenStyle}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={goBack} style={styles.iconStyle}>
            <Icon name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitleStyle}>Add Workspace</Text>
        </View>

        <ScrollView>
          <View style={styles.bodyContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace Name</Text>
              <TextInput style={styles.textInput} />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace Description</Text>
              <TextInput
                multiline={true}
                numberOfLines={5}
                style={styles.textInput}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace Type</Text>
              <View style={styles.pickerInput}>
                <Picker
                  mode="dropdown"
                  style={styles.pickerInput}
                  selectedValue={workspaceType}
                  onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
                  <Picker.Item label="Non-Profit" value="2" />
                  <Picker.Item label="Profit" value="1" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Is Verified</Text>
              <View style={styles.pickerInput}>
                <Picker
                  mode="dropdown"
                  style={styles.pickerInput}
                  selectedValue={workspaceType}
                  onValueChange={(itemValue, itemIndex) => setType(itemValue)}>
                  <Picker.Item label="Yes" value="yes" />
                  <Picker.Item label="No" value="no" />
                </Picker>
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={openPicker}
                activeOpacity={0.7}
                style={styles.buttonStyle}>
                <Entypo name="camera" size={20} color="#fff" />
                <Text style={styles.buttonText}>Add photo</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.inputContainer, { alignItems: 'center' }]}>
              <View style={{ position: 'relative' }}>
                <Image
                  style={styles.uploadImg}
                  source={require('../../../../../logo.png')}
                />
                <TouchableOpacity style={styles.crossIcon}>
                  <Entypo name="cross" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default AddWorkSpace;
