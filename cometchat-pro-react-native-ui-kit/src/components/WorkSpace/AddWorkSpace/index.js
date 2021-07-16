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
  ActivityIndicator,
} from 'react-native';
import theme from '../../../resources/theme';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import { logger } from '../../../utils/common';
// import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CometChatAddGroupMemberList from '../../Groups/CometChatAddGroupMemberList';
import CustomInput from '../../../common/CustomInput/CustomInput';
import CustomPicker from '../../../common/CustomPicker/CustomPicker';
import { onAddWorkSpace } from '../../../../../store/action';

const workTypes = [
  { label: 'Non-Profit', value: 1 },
  { label: 'Profit', value: 2 },
];

const workVerified = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
];

const AddWorkSpace = (props) => {
  const dispatch = useDispatch();
  const [workspaceType, setType] = useState(1);
  const [avatar, setAvatar] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({
    workspaceName: '',
    description: '',
  });
  const [isVerified, setVerified] = useState(false);

  const onChangeHandler = (name, val) => {
    console.log('handler:', name, val);
    setState({
      ...state,
      [name]: val,
    });
  };

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
      // width: 300,
      // height: 400,
      cropperCircleOverlay: true,
      cropping: true,
    }).then((image) => {
      console.log('pics:', image);
      setAvatar(image);
    });
  };

  const cancelImage = () => {
    setAvatar('');
  };

  const closeModal = () => {
    setAddMembers(false);
  };

  const openModal = () => {
    setAddMembers(true);
  };

  const selectedMembers = (list) => {
    setMembersList(list);
  };

  const onSave = () => {
    setLoader(true);
    if (state.workspaceName === '') {
      alert('Workspace name is required!');
      setLoader(false);
    } else if (state.description === '') {
      alert('Description is required');
      setLoader(false);
    } else if (!avatar) {
      alert('Image is required');
      setLoader(false);
    } else if (membersList.length === 0) {
      alert('At least select one member');
      setLoader(false);
    } else {
      console.log(
        'data:',
        state.workspaceName,
        state.description,
        avatar,
        membersList,
        workspaceType,
        isVerified,
      );

      const data = new FormData();

      const imgObj = {
        type: avatar.mime,
        uri: avatar.path,
        name: 'multiple file',
      };

      membersList.forEach((user) => {
        data.append('ws_users', { uuid: user.uid });
      });
      data.append('name', state.workspaceName);
      data.append('ws_description', state.description);
      data.append('ws_type', workspaceType);
      data.append('ws_is_verified', isVerified);
      data.append('ws_featured_image', imgObj);

      try {
        dispatch(onAddWorkSpace(data));
        setLoader(false);
      } catch (err) {
        setLoader(false);
        console.log('err in catch', err);
      }
    }
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
              <CustomInput
                name={state.workspaceName}
                onChangeHandler={(val) => onChangeHandler('workspaceName', val)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace Description</Text>
              <CustomInput
                name={state.description}
                onChangeHandler={(val) => onChangeHandler('description', val)}
                multiline={true}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace Type</Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={workTypes}
                  value={workspaceType}
                  onChangeHandler={(itemValue, itemIndex) => setType(itemValue)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Is Verified</Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={workVerified}
                  value={isVerified}
                  onChangeHandler={(itemValue, itemIndex) =>
                    setVerified(itemValue)
                  }
                />
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

            {avatar ? (
              <View style={[styles.inputContainer, { alignItems: 'center' }]}>
                <View style={{ position: 'relative' }}>
                  <Image
                    style={styles.uploadImg}
                    source={{ uri: avatar.path }}
                  />
                  <TouchableOpacity
                    onPress={cancelImage}
                    style={styles.crossIcon}>
                    <Entypo name="cross" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>
            ) : null}

            <TouchableOpacity onPress={openModal} style={styles.memberView}>
              <Icon name="add" color="#338ce2" size={35} />
              <Text style={styles.memberText}>Add Members</Text>
            </TouchableOpacity>

            {membersList.length > 0 ? (
              <View style={{ marginBottom: 10, marginLeft: 10 }}>
                <Text>{`${membersList.length} ${
                  membersList.length === 1
                    ? 'member selected'
                    : 'members selected'
                }`}</Text>
              </View>
            ) : null}

            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={onSave}
                style={styles.saveButton}
                activeOpacity={0.7}>
                {loader ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.saveText}>Save</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </View>
      {addMembers ? (
        <CometChatAddGroupMemberList
          workspace
          selectedMembers={selectedMembers}
          open={addMembers}
          close={closeModal}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default AddWorkSpace;
