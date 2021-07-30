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
import { CometChat } from '@cometchat-pro/react-native-chat';
import theme from '../../../resources/theme';
import { useSelector, useDispatch } from 'react-redux';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CometChatAddGroupMemberList from '../../Groups/CometChatAddGroupMemberList';
import CustomInput from '../../../common/CustomInput/CustomInput';
import CustomPicker from '../../../common/CustomPicker/CustomPicker';
import {
  onAddWorkSpace,
  getWorkSpacesTypes,
  selectWorkSpace,
  addNewTeam,
} from '../../../../../store/action';
import axios from 'axios';
import { serverUrl } from '../../../utils/consts';

let customTypes = [];

const AddTeam = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.jwtToken);
  const workList = useSelector((state) => state.reducer.allWorkspaces);
  const uid = useSelector((state) => state.reducer.user.uid);
  const [workspaceType, setType] = useState('asds');
  const [avatar, setAvatar] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [imageLoader, setImageLoader] = useState(false);
  const [workSpacesArray, setWorkArray] = useState([]);
  const [state, setState] = useState({
    teamName: '',
    description: '',
  });

  useEffect(() => {
    console.log('work list***', workList.data);
    customTypes = [];
    const workListData = workList.data;
    if (workList.data)
      for (var i = 0; i < workListData.length; i++) {
        const customObj = {
          label: workListData[i].st_name,
          value: workListData[i].in_workspace_id,
        };
        customTypes.push(customObj);
      }
    setWorkArray(customTypes);
  }, [workList]);

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
      includeBase64: true,
    }).then((image) => {
      console.log('pics:', image);
      setImageLoader(true);
      setAvatar(image.data);

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
          setAvatar(response.data.globals.file_upload_url);
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

  const onSave = async () => {
    const usersData = [uid];
    setLoader(true);
    if (state.teamName === '') {
      alert('Team name is required!');
      setLoader(false);
    } else if (state.description === '') {
      alert('Description is required');
      setLoader(false);
    } else if (workspaceType === null) {
      alert('Workspace is required');
      setLoader(false);
    } else if (!avatar) {
      alert('Image is required');
      setLoader(false);
    } else if (membersList.length === 0) {
      alert('At least select one member');
      setLoader(false);
    } else {
      membersList.forEach((user) => {
        usersData.push(user.uid);
      });

      console.log('typeeee:', workspaceType);

      var GUID = `ws-${workspaceType}-team-${new Date().getTime()}`;
      var groupName = state.teamName;
      var groupDescription = state.description;
      var groupMetaData = {
        workspace_id: workspaceType,
        workspace_name: customTypes.find((a) => a.value === workspaceType)
          .label,
      };
      var groupType = CometChat.GROUP_TYPE.PUBLIC;
      var password = '';
      var icon = avatar;
      var group = new CometChat.Group(
        GUID,
        groupName,
        groupType,
        password,
        icon,
        groupDescription,
        '',
      );

      group.setMetadata(groupMetaData);
      console.log('group:::', group);

      CometChat.createGroup(group).then(
        (group) => {
          console.log('Team data:', group);
          dispatch(addNewTeam(group));
          setLoader(false);
          setState({
            teamName: '',
            description: '',
          });
          setAvatar('');
          setMembersList([]);
          setType('');
          alert('Team created successfully');
        },
        (error) => {
          setLoader(false);
          alert('Something went wrong!');
          console.log('Team creation failed with exception:', error);
        },
      );
    }
  };

  return (
    <SafeAreaView style={styles.workScreenStyle}>
      <View style={styles.mainContainer}>
        <View style={styles.headingContainer}>
          <TouchableOpacity onPress={goBack} style={styles.iconStyle}>
            <Icon name="arrow-back" size={25} />
          </TouchableOpacity>
          <Text style={styles.headerTitleStyle}>Add Team</Text>
        </View>

        <ScrollView>
          <View style={styles.bodyContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Team Name</Text>
              <CustomInput
                name={state.teamName}
                onChangeHandler={(val) => onChangeHandler('teamName', val)}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Team Description</Text>
              <CustomInput
                name={state.description}
                onChangeHandler={(val) => onChangeHandler('description', val)}
                multiline={true}
                customStyle={styles.customInputStyle}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace</Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={workSpacesArray}
                  value={workspaceType}
                  onChangeHandler={(itemValue) => setType(itemValue)}
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
                  <Image style={styles.uploadImg} source={{ uri: avatar }} />
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
                onPress={loader ? () => {} : onSave}
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
          theme={theme}
          workspace
          selectedMembers={selectedMembers}
          open={addMembers}
          close={closeModal}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default AddTeam;
