import React, { useEffect, useState } from 'react';
import styles from './style';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CometChat } from '@cometchat-pro/react-native-chat';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CustomInput from '../../../common/CustomInput/CustomInput';
import CustomPicker from '../../../common/CustomPicker/CustomPicker';
import { onUpdateGroup, onAddGroup } from '../../../../../store/action';
import axios from 'axios';
import { serverUrl } from '../../../utils/consts';

const workTypes = [
  { label: 'Non-Profit', value: 1 },
  { label: 'Profit', value: 2 },
];

let customTypes = [];

const AddUsers = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.jwtToken);

  const uid = useSelector((state) => state.reducer.user.uid);
  const [teamType, setType] = useState('');
  const [avatar, setAvatar] = useState('');

  const [membersList, setMembersList] = useState([]);
  const [imageLoader, setImageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({
    groupName: '',
    description: '',
    isImageUploaded: false,
  });
  const [groupsData, setGroupData] = useState(undefined);

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
      cropperCircleOverlay: true,
      cropping: true,
      includeBase64: true,
    }).then((image) => {
      console.log('pics:', image);
      setImageLoader(true);
      // setAvatar(image);
      setState({ ...state, isImageUploaded: true });

      const data = {
        image: `data:image/image/png;base64,${image.data}`,
      };

      axios({
        url: serverUrl + 'global/image',
        method: 'post',
        data,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          console.log('image response:', response.data.globals.file_upload_url);
          setAvatar({ path: response.data.globals.file_upload_url });
          setImageLoader(false);
        })
        .catch((err) => {
          console.log('error in Image:', err);
          console.log('error in Image:', err.response);
          setImageLoader(false);
        });
    });
  };

  const cancelImage = () => {
    setAvatar('');
    setState({ ...state, isImageUploaded: false });
  };

  const onSave = async () => {
    const usersData = [];
    setLoader(true);
    if (state.groupName === '') {
      alert('Group name is required!');
      setLoader(false);
    } else if (state.description === '') {
      alert('Description is required');
      setLoader(false);
    } else if (teamType === '') {
      alert('Team is required');
      setLoader(false);
    } else if (!avatar) {
      alert('Image is required');
      setLoader(false);
    } else {
      console.log('user:::', membersList);
      membersList.forEach((user) => {
        if (typeof user === 'object' && user !== null) {
          console.log('test user::::', typeof membersList);
          if (user.uid !== uid) {
            usersData.push(
              new CometChat.GroupMember(
                user.uid,
                CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT,
              ),
            );
          }
        } else {
          if (user !== uid) {
            usersData.push(
              new CometChat.GroupMember(
                user,
                CometChat.GROUP_MEMBER_SCOPE.PARTICIPANT,
              ),
            );
          }
        }
      });

      let teamId = teamType.replace('-team-', '-teamgroup-');
      var guid = groupsData
        ? groupsData.guid
        : `${teamId}-group-${new Date().getTime()}`;
      var groupName = state.groupName;
      var groupDescription = state.description;
      var groupMetaData = { team_id: teamId, team_name: state.description };
      var groupType = CometChat.GROUP_TYPE.PUBLIC;
      var password = '';
      var icon = avatar.path;
      var group = new CometChat.Group(
        guid,
        groupName,
        groupType,
        password,
        icon,
        groupDescription,
        '',
      );

      group.setMetadata(groupMetaData);

      console.log('data to watch:', group);

      console.log('group edit:', groupsData);

      if (groupsData) {
        CometChat.updateGroup(group).then(
          (groupData) => {
            setLoader(false);
            console.log('group response:::', groupData);
            dispatch(onUpdateGroup(groupData));

            Alert.alert('Success', 'Group updated successfully', [
              { text: 'OK', onPress: () => goBack() },
            ]);

            CometChat.addMembersToGroup(groupData.guid, usersData, []).then(
              (response) => {
                console.log('Add member:', response);
              },
              (error) => {
                console.log('error in update members:', error);
                alert('Only admins and moderators can perform this action.');
              },
            );
          },
          (error) => {
            setLoader(false);
            console.log('Group updated failed with exception:', error);
            alert(error.message);
          },
        );
      } else {
        CometChat.createGroup(group).then(
          (groupData) => {
            setLoader(false);
            console.log('group response:::', groupData);
            dispatch(onAddGroup(groupData));

            Alert.alert('Success', 'Group created successfully', [
              { text: 'OK', onPress: () => goBack() },
            ]);

            setType('');
            setState({
              ...state,
              description: '',
              groupName: '',
            });
            setAvatar('');
            setMembersList([]);

            CometChat.addMembersToGroup(groupData.guid, usersData, []).then(
              (response) => {
                console.log('Add member:', response);
              },
              (error) => {
                console.log('Something went wrong:', error);
              },
            );
          },
          (error) => {
            setLoader(false);
            console.log('Group creation failed with exception:', error);
          },
        );
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
          <Text style={styles.headerTitleStyle}>Add Users</Text>
        </View>

        <ScrollView>
          <View style={styles.bodyContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>User Name</Text>
              <CustomInput
                name={state.groupName}
                onChangeHandler={(val) => onChangeHandler('groupName', val)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>About</Text>
              <CustomInput
                name={state.description}
                onChangeHandler={(val) => onChangeHandler('description', val)}
                multiline={true}
                customStyle={styles.customInputStyle}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Teams</Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={customTypes ? customTypes : workTypes}
                  value={teamType}
                  onChangeHandler={(itemValue) => setType(itemValue)}
                  label={'Select Team'}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <TouchableOpacity
                onPress={openPicker}
                activeOpacity={0.7}
                style={styles.buttonStyle}>
                {imageLoader ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <>
                    <Entypo name="camera" size={20} color="#fff" />
                    <Text style={styles.buttonText}>Add photo</Text>
                  </>
                )}
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

            <View style={styles.inputContainer}>
              <TouchableOpacity
                // onPress={onSave}
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
    </SafeAreaView>
  );
};
export default AddUsers;
