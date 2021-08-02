import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React, { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';

import LoginPage from './defaultPages/LoginPage';
import HomePage from './defaultPages/HomePage';
import {
  CometChatUserProfile,
  CometChatUI,
  CometChatMessages,
  CometChatUserListWithMessages,
  CometChatUserList,
  CometChatGroupListWithMessages,
  CometChatGroupList,
  CometChatConversationListWithMessages,
  CometChatConversationList,
} from './cometchat-pro-react-native-ui-kit';
import { authCheckState, jwtToken } from './store/action';
import WorkSpaceList from './cometchat-pro-react-native-ui-kit/src/components/WorkSpace/WorkSpaceList';
import AddWorkSpace from './cometchat-pro-react-native-ui-kit/src/components/WorkSpace/AddWorkSpace';
import TeamList from './cometchat-pro-react-native-ui-kit/src/components/Teams/TeamList';
import AddTeam from './cometchat-pro-react-native-ui-kit/src/components/Teams/AddTeams';
import OfflineNotice from './OfflineNotice';
import GroupsList from './cometchat-pro-react-native-ui-kit/src/components/Groups/GroupsList';
import AddGroups from './cometchat-pro-react-native-ui-kit/src/components/Groups/AddGroups';

function StackNavigator(props) {
  const Stack = createStackNavigator();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(jwtToken());
  }, []);

  return (
    <>
      <OfflineNotice />
      <NavigationContainer>
        <Stack.Navigator
          headerMode="none"
          initialRouteName={props.isLoggedIn ? 'HomePage' : null}
        >
          <Stack.Screen name="LoginPage" component={LoginPage} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="CometChatUI" component={CometChatUI} />
          <Stack.Screen
            name="Conversation"
            component={CometChatConversationListWithMessages}
          />
          <Stack.Screen
            name="ConversationComponent"
            component={CometChatConversationList}
          />
          <Stack.Screen
            name="Group"
            component={CometChatGroupListWithMessages}
          />
          <Stack.Screen name="GroupComponent" component={CometChatGroupList} />
          <Stack.Screen
            name="Users"
            component={CometChatUserListWithMessages}
          />
          <Stack.Screen name="UsersComponent" component={CometChatUserList} />
          <Stack.Screen
            name="CometChatMessages"
            component={CometChatMessages}
          />
          <Stack.Screen name="WorkSpaceList" component={WorkSpaceList} />
          <Stack.Screen name="AddWorkSpace" component={AddWorkSpace} />
          <Stack.Screen name="TeamList" component={TeamList} />
          <Stack.Screen name="AddTeam" component={AddTeam} />
          <Stack.Screen name="GroupsList" component={GroupsList} />
          <Stack.Screen name="AddGroups" component={AddGroups} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const mapStateToProps = ({ reducer }) => {
  return {
    loading: reducer.loading,
    error: reducer.error,
    isLoggedIn: reducer.isLoggedIn,
  };
};

export default connect(mapStateToProps)(StackNavigator);
