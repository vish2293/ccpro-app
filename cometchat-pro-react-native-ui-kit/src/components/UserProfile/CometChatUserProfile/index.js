import React, { useEffect, useState } from 'react';
import { CometChatManager } from '../../../utils/controller';
import { CometChatAvatar } from '../../Shared';
import styles from './styles';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import theme from '../../../resources/theme';

import Icon from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { logger } from '../../../utils/common';

const notificationIcon = (
  <Icon color={theme.color.helpText} name="notifications" size={28} />
);
const privacyIcon = (
  <Icon color={theme.color.helpText} name="security" size={28} />
);
const chatIcon = <Icon color={theme.color.helpText} name="chat" size={28} />;
const helpIcon = <Icon color={theme.color.helpText} name="help" size={28} />;
const problemIcon = (
  <Icon color={theme.color.helpText} name="report-problem" size={28} />
);
const workIcon = <Icon color={theme.color.helpText} name="work" size={28} />;
const teamIcon = (
  <FontAwesome color={theme.color.helpText} name="slideshare" size={28} />
);
const groupsIcon = (
  <FontAwesome color={theme.color.helpText} name="users" size={28} />
);
const userIcon = (
  <FontAwesome5 color={theme.color.helpText} name="user-alt" size={28} />
);

const CometChatUserProfile = (props) => {
  const [user, setUser] = useState({});
  const viewTheme = { ...theme, ...props.theme };

  /**
   * Retrieve logged in user details
   * @param
   */
  const getProfile = () => {
    new CometChatManager()
      .getLoggedInUser()
      .then((loggedInUser) => {
        setUser(loggedInUser);
      })
      .catch((error) => {
        logger(
          '[CometChatUserProfile] getProfile getLoggedInUser error',
          error,
        );
      });
  };

  useEffect(() => {
    getProfile();
  }, []);
  let avatar = null;
  if (user) {
    avatar = (
      <View style={styles.avatarStyle}>
        <CometChatAvatar
          cornerRadius={18}
          borderColor={viewTheme.color.secondary}
          borderWidth={1}
          image={{ uri: user.avatar }}
          name={user.name}
        />
      </View>
    );
  }

  const goToWorkScreen = () => {
    const { navigation } = props;
    navigation.navigate('WorkSpaceList');
  };

  const goToTeamsList = () => {
    const { navigation } = props;
    navigation.navigate('TeamList');
  };

  const goToGroupsLIst = () => {
    const { navigation } = props;
    navigation.navigate('GroupsList');
  };

  const goToUsersList = () => {
    const { navigation } = props;
    navigation.navigate('UsersList');
  };

  return (
    <SafeAreaView style={styles.userInfoScreenStyle}>
      <View style={styles.headingContainer}>
        <Text style={styles.headerTitleStyle}>More</Text>
      </View>
      <View style={styles.userContainer}>
        <View style={styles.avatarContainer}>{avatar}</View>
        {user?.name ? (
          <View style={styles.userDetailsContainer}>
            <View style={styles.userNameWrapper}>
              <Text style={styles.userName}>{user?.name}</Text>
            </View>
            <Text style={styles.status}>Online</Text>
          </View>
        ) : null}
      </View>
      <View style={styles.infoItemsWrapper}>
        <View style={styles.infoItemHeadingContainer}>
          <Text style={styles.infoItemHeadingText}>Preferences</Text>
        </View>
        <ScrollView>
          <View style={styles.infoItemsContainer}>
            {/* <View style={styles.infoItem}>
              {notificationIcon}
              <Text style={styles.infoItemText}>Notifications</Text>
            </View>
            <View style={styles.infoItem}>
              {privacyIcon}
              <Text style={styles.infoItemText}>Privacy and Security</Text>
            </View>
            <View style={styles.infoItem}>
              {chatIcon}
              <Text style={styles.infoItemText}>Chats</Text>
            </View> */}
            <TouchableOpacity onPress={goToWorkScreen} style={styles.infoItem}>
              {workIcon}
              <Text style={styles.infoItemText}>Workspaces</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToTeamsList} style={styles.infoItem}>
              {teamIcon}
              <Text style={styles.infoItemText}>Teams</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToGroupsLIst} style={styles.infoItem}>
              {groupsIcon}
              <Text style={styles.infoItemText}>Groups</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={goToUsersList} style={styles.infoItem}>
              {userIcon}
              <Text style={styles.infoItemText}>Users</Text>
            </TouchableOpacity> */}
          </View>
          {/* <View style={styles.infoItemHeadingContainer}>
            <Text style={styles.infoItemHeadingText}>Other</Text>
          </View> */}
          {/* <View style={styles.infoItemsContainer}>
            <View style={styles.infoItem}>
              {helpIcon}
              <Text style={styles.infoItemText}>Help</Text>
            </View>
            <View style={styles.infoItem}>
              {problemIcon}
              <Text style={styles.infoItemText}>Report a Problem</Text>
            </View>
          </View> */}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};
export default CometChatUserProfile;
