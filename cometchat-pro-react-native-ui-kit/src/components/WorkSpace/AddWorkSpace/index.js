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
  generatePatternImage,
} from '../../../../../store/action';
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

const AddWorkSpace = (props) => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.reducer.jwtToken);
  const workSpaceTypes = useSelector((state) => state.reducer.workspaceTypes);
  const uid = useSelector((state) => state.reducer.user.uid);
  const [workspaceType, setType] = useState('1');
  const [avatar, setAvatar] = useState('');
  const [addMembers, setAddMembers] = useState(false);
  const [membersList, setMembersList] = useState([]);
  const [loader, setLoader] = useState(false);
  const [state, setState] = useState({
    workspaceName: '',
    description: '',
    isImageUploaded: false,
  });
  const [workspaceData, setWorkspaceData] = useState(undefined);
  const [isVerified, setVerified] = useState('0');
  const [displayError, setError] = useState('');
  const [imageLoader, setImageLoader] = useState(false);

  useEffect(() => {
    dispatch(getWorkSpacesTypes());
  }, []);

  useEffect(() => {
    const { navigation, route } = props;
    const workspace = route.params.data;
    const image = route.params.image;
    setWorkspaceData(workspace);
    console.log('workspaceData', workspace, workspaceData);
    if (workspaceData) {
      console.log('Edit Mode');
      setType(workspaceData.st_type_name == 'Profit' ? 2 : 1);
      let isVerified = workspaceData.in_is_verified
        ? workspaceData.in_is_verified
        : '0';
      setVerified(isVerified.toString());
      console.log('image', image);
      setAvatar(image);
      console.log(JSON.parse(workspaceData?.js_users).length);
      setMembersList(JSON.parse(workspaceData.js_users));
      setState({
        workspaceName: workspaceData.st_name,
        description: workspaceData.st_description,
      });
    }

    customTypes = [];
    console.log('Types here::::', workSpaceTypes);
    if (workSpaceTypes)
      for (var i = 0; i < workSpaceTypes.length; i++) {
        console.log('shallow:', workSpaceTypes[i]);
        const customObj = {
          label: workSpaceTypes[i].st_type_name,
          value: workSpaceTypes[i].in_type_id,
        };
        customTypes.push(customObj);
      }
  }, [workSpaceTypes]);

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
          setState({ ...state, isImageUploaded: true });
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
    const usersData = [uid];
    setLoader(true);
    if (state.workspaceName === '') {
      setError('name required');
      // alert('Workspace name is required!');
      setLoader(false);
    } else if (state.description === '') {
      setError('description required');
      // alert('Description is required');
      setLoader(false);
    }
    // else if (!avatar) {
    //   alert('Image is required');
    //   setLoader(false);
    // }
    // else if (membersList.length === 0) {
    //   alert('At least select one member');
    //   setLoader(false);
    // }
    else {
      if (!avatar) {
        const myData = {
          text: `${new Date()}`,
        };
        const imageResponse = await dispatch(generatePatternImage(myData));
        console.log('response here:', imageResponse);
        patternImage = imageResponse.data.globals.file_upload_url;
      }

      console.log('user:::', membersList);
      membersList.forEach((user) => {
        if (typeof user === 'object' && user !== null) {
          console.log('test user::::', typeof membersList);
          if (user.uid !== uid) {
            usersData.push(user.uid);
          }
        } else {
          if (user !== uid) {
            usersData.push(user);
          }
        }
      });

      const data = {
        addMember: false,
        viewMember: false,
        ws_name: state.workspaceName,
        ws_description: state.description,
        ws_users: usersData,
        ws_type: JSON.stringify(workspaceType),
        ws_is_verified: isVerified,
        ws_featured_image: avatar ? avatar : patternImage,
        ws_type_options: workSpaceTypes,
      };

      console.log('data to watch:', data);

      try {
        let response;
        let error;
        let success;
        if (workspaceData) {
          data.id = workspaceData.in_workspace_id;
          response = await dispatch(onEditWorkSpace(data));
          success = 'Workspace updated successfully!';
          error = 'workspace not updated!';
        } else {
          response = await dispatch(onAddWorkSpace(data));
          success = 'Workspace added successfully!';
          error = 'workspace not added!';
        }
        console.log('succcess:', response);
        setLoader(false);
        if (response.error_code) {
          alert(error);
        } else {
          Alert.alert('Success', success, [
            { text: 'OK', onPress: () => goBack() },
          ]);
          if (!workspaceData) {
            setState({
              workspaceName: '',
              description: '',
            });
            setAvatar('');
            setType('1');
            setVerified('0');
            setMembersList([]);
          }
        }
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
              <Text style={styles.labelStyle}>
                Workspace Name <Text style={styles.asterikStyle}>*</Text>
              </Text>
              <CustomInput
                name={state.workspaceName}
                onChangeHandler={(val) => onChangeHandler('workspaceName', val)}
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
                Workspace Description <Text style={styles.asterikStyle}>*</Text>
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
              {displayError === 'description required' ? (
                <Text style={styles.errorStyle}>This is required field!</Text>
              ) : null}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Workspace Type</Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={customTypes ? customTypes : workTypes}
                  value={workspaceType}
                  onChangeHandler={(itemValue) => setType(itemValue)}
                />
              </View>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.labelStyle}>Is Verified</Text>
              <View style={styles.pickerInput}>
                <CustomPicker
                  data={workVerified}
                  value={isVerified}
                  onChangeHandler={(itemValue) => setVerified(itemValue)}
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
        />
      ) : null}
    </SafeAreaView>
  );
};
export default AddWorkSpace;
