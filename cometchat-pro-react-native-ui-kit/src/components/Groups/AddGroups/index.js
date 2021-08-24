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
  Alert,
} from 'react-native';
import theme from '../../../resources/theme';
import { useSelector, useDispatch } from 'react-redux';
import { CometChat } from '@cometchat-pro/react-native-chat';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import { Picker } from '@react-native-picker/picker';
import { logger } from '../../../utils/common';
// import { launchImageLibrary } from 'react-native-image-picker';
import ImagePicker from 'react-native-image-crop-picker';
import CometChatAddGroupMemberList from '../../Groups/CometChatAddGroupMemberList';
import CustomInput from '../../../common/CustomInput/CustomInput';
import CustomPicker from '../../../common/CustomPicker/CustomPicker';
import {
  onAddWorkSpace,
  getWorkSpacesTypes,
  selectWorkSpace,
  onEditWorkSpace,
  onGetAllTeams,
  onUpdateGroup,
  onAddGroup,
  generatePatternImage,
} from '../../../../../store/action';
import { GroupListManager } from '../../Teams/CometChatTeamList/controller';
import axios from 'axios';
import { serverUrl } from '../../../utils/consts';

const workTypes = [
  { label: 'Non-Profit', value: 1 },
  { label: 'Profit', value: 2 },
];

const workVerified = [
  { label: 'No', value: '0' },
  { label: 'Yes', value: '1' },
];

let customTypes = [];

const AddGroups = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.jwtToken);
  const workSpaceTypes = useSelector((state) => state.reducer.workspaceTypes);
  const selectedWorkspace = useSelector(
    (state) => state.reducer.selectedWorkSpace,
  );
  const uid = useSelector((state) => state.reducer.user.uid);
  const [teamType, setType] = useState('');
  const [avatar, setAvatar] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [imageLoader, setImageLoader] = useState(false);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({
    groupName: '',
    description: '',
    isImageUploaded: false,
  });
  const [groupsData, setGroupData] = useState(undefined);
  const [isEdit, setEdit] = useState(false);
  const [displayError, setError] = useState('');

  const getTeams = async () => {
    const copyList = [];

    let val = `${selectedWorkspace.st_guid}-team-`;
    console.log('value::', val);
    const GroupListManagerObject = new GroupListManager(val);
    await GroupListManagerObject.fetchNextGroups().then(async (groupList) => {
      console.log('Teamssss:::', groupList);

      if (groupList.length === 0) {
      } else {
        customTypes = [];
        for (var a = 0; a < groupList.length; a++) {
          copyList.push(groupList[a]);
          console.log('copy List', groupList[a]);
          const customObj = {
            label: groupList[a].name,
            value: groupList[a].guid,
          };
          customTypes.push(customObj);
        }
        return true;
      }
    });
    // dispatch(onGetAllTeams(copyList));
  };

  useEffect(() => {
    getTeams();
  }, []);

  useEffect(() => {
    const { navigation, route } = props;
    const groupData = route.params.data;
    setGroupData(groupData);
    console.log('group data:', groupData);
    if (groupData) {
      let teamId = groupData.metadata.team_id.replace('-teamgroup-', '-team-');
      console.log('Edit Mode', teamId);
      setType(teamId);
      setEdit(true);

      setAvatar({ path: groupData.icon });
      //   console.log(JSON.parse(groupsData?.js_users).length);
      //   setMembersList(JSON.parse(groupsData.js_users));
      setState({
        groupName: groupData.name,
        description: groupData.description,
      });

      var GUID = groupData.guid;
      var limit = 30;
      var groupMemberRequest = new CometChat.GroupMembersRequestBuilder(GUID)
        .setLimit(limit)
        .build();

      groupMemberRequest.fetchNext().then(
        (groupMembers) => {
          console.log('Group Member list fetched successfully:', groupMembers);
          setMembersList(groupMembers);
        },
        (error) => {
          console.log(
            'Group Member list fetching failed with exception:',
            error,
          );
        },
      );
    }
  }, []);

  const onChangeHandler = (name, val) => {
    console.log('handler:', name, val);
    setError('');
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
    let patternImage = '';
    const usersData = [];
    setLoader(true);
    if (state.groupName === '') {
      // alert('Group name is required!');
      setError('name required');
      setLoader(false);
    } else if (state.description === '') {
      // alert('Description is required');
      setError('description required');
      setLoader(false);
    } else if (teamType === '') {
      // alert('Team is required');
      setError('team required');
      setLoader(false);
    } else if (membersList.length === 0) {
      alert('At least select one member');
      setLoader(false);
    } else {
      if (!avatar) {
        const data = {
          text: `${new Date()}`,
        };

        const imageResponse = await dispatch(generatePatternImage(data));
        console.log('response here:', imageResponse);
        patternImage = imageResponse.data.globals.file_upload_url;
      }

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
      var icon = avatar ? avatar.path : patternImage;

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
          <Text style={styles.headerTitleStyle}>Add Groups</Text>
        </View>

        <ScrollView>
          <View style={styles.bodyContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>
                Group Name <Text style={styles.asterikStyle}>*</Text>
              </Text>
              <CustomInput
                name={state.groupName}
                onChangeHandler={(val) => onChangeHandler('groupName', val)}
                customStyle={
                  displayError === 'name required' ? styles.inputError : null
                }
              />
            </View>
            {displayError === 'name required' ? (
              <Text style={styles.errorStyle}>This is required field!</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>
                Group Description <Text style={styles.asterikStyle}>*</Text>
              </Text>
              <CustomInput
                name={state.description}
                onChangeHandler={(val) => onChangeHandler('description', val)}
                multiline={true}
                customStyle={[
                  styles.customInputStyle,
                  displayError === 'description required'
                    ? { borderColor: 'red' }
                    : null,
                ]}
              />
            </View>
            {displayError === 'description required' ? (
              <Text style={styles.errorStyle}>This is required field!</Text>
            ) : null}

            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>
                Teams <Text style={styles.asterikStyle}>*</Text>
              </Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={customTypes ? customTypes : workTypes}
                  value={teamType}
                  onChangeHandler={(itemValue) => {
                    setType(itemValue), setError('');
                  }}
                  label={'Select Team'}
                  // customStyle={styles.inputError}
                />
              </View>
            </View>
            {displayError === 'team required' ? (
              <Text style={styles.errorStyle}>This is required field!</Text>
            ) : null}

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

            <TouchableOpacity onPress={openModal} style={styles.memberView}>
              <Icon name="add" color="#338ce2" size={35} />
              <Text style={styles.memberText}>
                {isEdit ? 'Manage Members' : 'Add Members'}
              </Text>
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
          theme={theme}
          workspace
          selectedMembers={selectedMembers}
          open={addMembers}
          close={closeModal}
          membersList={membersList}
        />
      ) : null}
    </SafeAreaView>
  );
};
export default AddGroups;
