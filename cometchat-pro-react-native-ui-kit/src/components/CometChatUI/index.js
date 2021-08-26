/* eslint-disable import/no-duplicates */
import React, { useEffect, useRef, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, AppState } from 'react-native';
import { CometChatGroupListWithMessages } from '../Groups';
import { CometChatUserListWithMessages } from '../Users';
import { CometChatConversationListWithMessages } from '../Chats';
import { CometChatContextProvider } from '../../utils/CometChatContext';
import { CometChatUserProfile } from '../UserProfile';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MCIIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import theme from '../../resources/theme';
import { heightRatio } from '../../utils/consts';
import WorkSpace from '../WorkSpace/index';
import { workSpaceList, selectTab } from '../../../../store/action';
import { useDispatch, useSelector } from 'react-redux';
import { CometChatTeamList } from '../Teams';
import { useNavigation } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

function CometChatUI() {
  const navigation = useNavigation();
  const [tabs, setTabs] = useState(null);
  const contextRef = useRef(null);
  const dispatch = useDispatch();
  const workList = useSelector((state) => state.reducer.workSpace);

  useEffect(() => {
    checkRestrictions();
    getWorkSpaceList();
  }, []);

  const getWorkSpaceList = () => {
    dispatch(workSpaceList());
  };

  useEffect(() => {
    AppState.addEventListener('change', () => {
      console.log('App State:', AppState.currentState);
      dispatch(selectTab('Chat'));
    });
  }, []);

  const checkRestrictions = async () => {
    let isChatEnabled = await contextRef.current.state.FeatureRestriction.isRecentChatListEnabled();
    let isGroupListEnabled = await contextRef.current.state.FeatureRestriction.isGroupListEnabled();
    let isUserSettingsEnabled = await contextRef.current.state.FeatureRestriction.isUserSettingsEnabled();
    let isUserListEnabled = await contextRef.current.state.FeatureRestriction.isUserListEnabled();
    let isCallListEnabled = await contextRef.current.state.FeatureRestriction.isCallListEnabled();
    setTabs({
      isChatEnabled,
      isGroupListEnabled,
      isUserSettingsEnabled,
      isUserListEnabled,
      isCallListEnabled,
    });
  };

  const onPressButton = (val) => {
    console.log('Yes called', val);
    dispatch(selectTab(val));
  };

  return (
    <CometChatContextProvider ref={contextRef}>
      <View
        style={{
          flex: 1,
        }}>
        <WorkSpace workList={workList} />
        {tabs ? (
          <Tab.Navigator
            screenListeners={{
              state: (e) => {
                // Do something with the state
                console.log('state changed', e.data);
              },
            }}
            screenOptions={({ route }) => ({
              tabBarIcon: ({ color }) => {
                let iconName;

                if (route.name === 'Chats') {
                  return (
                    <MCIIcons
                      name="chat"
                      size={25 * heightRatio}
                      color={color}
                    />
                  );
                }
                if (route.name === 'More') {
                  return (
                    <MaterialIcons
                      name="more-horiz"
                      size={25 * heightRatio}
                      color={color}
                    />
                  );
                }
                if (route.name === 'Users') {
                  iconName = 'ios-person-circle-sharp';
                } else if (route.name === 'Teams') {
                  iconName = 'people';
                } else if (route.name === 'Call') {
                  iconName = 'md-call';
                }

                // You can return any component that you like here!
                return (
                  <Ionicons
                    name={iconName}
                    size={24 * heightRatio}
                    color={color}
                  />
                );
              },
            })}
            tabBarOptions={{
              activeTintColor: theme.color.blue,
              inactiveTintColor: 'rgba(0,0,0,0.5)',
              activeBackgroundColor: theme.color.white,
              inactiveBackgroundColor: theme.color.white,
              labelStyle: { fontSize: 12 },
            }}>
            {tabs.isChatEnabled && (
              <Tab.Screen
                name="Chats"
                component={CometChatConversationListWithMessages}
                listeners={{
                  tabPress: (e) => {
                    // Prevent default action
                    e.preventDefault();
                    onPressButton('Chat');
                    navigation.navigate('Chats');
                  },
                }}
              />
            )}
            {tabs.isUserListEnabled && (
              <Tab.Screen
                name="Users"
                component={CometChatUserListWithMessages}
              />
            )}
            {tabs.isGroupListEnabled && (
              <Tab.Screen name="Teams" component={CometChatTeamList} />
            )}
            {tabs.isChatEnabled && (
              <Tab.Screen
                name="Call"
                component={CometChatConversationListWithMessages}
                listeners={{
                  tabPress: (e) => {
                    // Prevent default action
                    e.preventDefault();
                    onPressButton('Call');
                    navigation.navigate('Call');
                  },
                }}
              />
            )}
            {tabs.isUserSettingsEnabled && (
              <Tab.Screen name="More" component={CometChatUserProfile} />
            )}
          </Tab.Navigator>
        ) : null}
      </View>
    </CometChatContextProvider>
  );
}

export default CometChatUI;
