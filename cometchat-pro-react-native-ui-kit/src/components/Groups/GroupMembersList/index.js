/* eslint-disable react/no-unused-state */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-param-reassign */
/* eslint-disable react/jsx-fragments */
/* eslint-disable react/static-property-placement */
import React from 'react';
import { CometChat } from '@cometchat-pro/react-native-chat';
import DropDownAlert from '../../Shared/DropDownAlert';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  FlatList,
  Modal,
  Dimensions,
  TouchableOpacity,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import BottomSheet from 'reanimated-bottom-sheet';
import Icon from 'react-native-vector-icons/Ionicons';

import { CometChatManager } from '../../../utils/controller';
import { AddMembersManager } from './controller';
import CometChatAddGroupMemberListItem from '../CometChatAddGroupMemberListItem';
import GroupDetailContext from '../CometChatGroupDetails/context';
import theme from '../../../resources/theme';
import style from './styles';
import { logger } from '../../../utils/common';

class GroupMembersList extends React.Component {
  static contextType = GroupDetailContext;

  decoratorMessage = 'Loading...';

  constructor(props) {
    super(props);
    this.state = {
      userList: [],
      textInputFocused: false,
      membersToAdd: [],
      filteredList: [],
      textInputValue: '',
      onToggle: false,
      isLoader: false,
    };
    this.sheetRef = React.createRef(null);
    this.textInputRef = React.createRef(null);
    this.theme = { ...theme, ...this.props.theme };
  }

  componentDidMount() {
    const group = this.context;
    const { uid } = this.props.userInfo;
    console.log('super idea::', group.memberList);

    const copyOfUsers = [];

    if (group.memberList.length === 0) {
      this.decoratorMessage = 'No users found';
    } else {
      group.memberList.forEach((member) => {
        if (member.isBanned === 0 && member.uid !== uid) {
          console.log('member List', member);
          copyOfUsers.push(member);
        }
      });
    }

    this.setState({
      filteredList: copyOfUsers,
    });

    if (this.props?.friendsOnly) {
      this.friendsOnly = this.props.friendsOnly;
    }

    this.AddMembersManager = new AddMembersManager();
    this.AddMembersManager.initializeMembersRequest().then(() => {
      // this.getUsers();
      this.AddMembersManager.attachListeners(this.userUpdated);
    });

    if (this.props.membersList) {
      this.setState({
        membersToAdd: this.props.membersList,
      });
    }
  }

  componentDidUpdate() {
    try {
      if (this.state.textInputFocused) {
        this.textInputRef.current.focus();
      }
    } catch (error) {
      logger(error);
    }
  }

  componentWillUnmount() {
    try {
      this.AddMembersManager.removeListeners();
      this.AddMembersManager = null;
    } catch (error) {
      logger(error);
    }
  }

  /**
   * updates the userList via user object updation.
   * @param user : Userobject
   */

  userUpdated = (user) => {
    try {
      const userList = [...this.state.userList];
      // search for user
      const userKey = userList.findIndex((u) => u.uid === user.uid);
      // if found in the list, update user object
      if (userKey > -1) {
        const userObj = userList[userKey];
        const newUserObj = { ...userObj, ...user };
        userList.splice(userKey, 1, newUserObj);
        this.setState({ userList });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * handles how the heading should be shown when the scroll(event) is done.
   * @param nativeEvent: event object
   */

  handleScroll = ({ nativeEvent }) => {
    try {
      if (nativeEvent.contentOffset.y > 35 && !this.state.showSmallHeader) {
        this.setState({
          showSmallHeader: true,
        });
      }
      if (nativeEvent.contentOffset.y <= 35 && this.state.showSmallHeader) {
        this.setState({
          showSmallHeader: false,
        });
      }
    } catch (error) {
      logger(error);
    }
  };

  /**
   * searches and fetches the user that can be added based on textInputValue.
   * @param val: TextInput's value
   */

  searchUsers = (val) => {
    this.setState({
      textInputValue: val,
    });
    // try {
    //   this.setState(
    //     { textInputValue: val },

    //     () => {
    //       if (this.timeout) {
    //         clearTimeout(this.timeout);
    //       }

    //       this.timeout = setTimeout(() => {
    //         this.AddMembersManager = new AddMembersManager(val);
    //         console.log('test:::', this.AddMembersManager);
    //         this.setState(
    //           {
    //             userList: [],
    //             membersToRemove: [],
    //             filteredList: [],
    //           },
    //           () => this.getUsers(),
    //         );
    //       }, 500);
    //     },
    //   );
    // } catch (error) {
    //   logger(error);
    // }
  };

  /**
   * fetches the users and updates the userList and filteredList
   * @param
   */

  getUsers = () => {
    new CometChatManager()
      .getLoggedInUser()
      .then(() => {
        this.AddMembersManager.fetchNextUsers()
          .then((userList) => {
            const filteredUserList = userList.filter((user) => {
              const found = this.context.memberList.find(
                (member) => user.uid === member.uid,
              );
              const foundBanned = this.context.bannedMemberList.find(
                (member) => user.uid === member.uid,
              );
              if (found || foundBanned) {
                return false;
              }
              return true;
            });

            if (filteredUserList.length === 0) {
              this.decoratorMessage = 'No users found';
            }
            this.setState({
              userList: [...this.state.userList, ...userList],
              filteredList: [...this.state.filteredList, ...filteredUserList],
            });
          })
          .catch((error) => {
            const errorCode = error?.message || 'ERROR';
            this.dropDownAlertRef?.showMessage('error', errorCode);
            this.decoratorMessage = 'Error';
            logger(
              '[CometChatAddGroupMemberList] getUsers fetchNext error',
              error,
            );
          });
      })
      .catch((error) => {
        this.decoratorMessage = 'Error';
        logger(
          '[CometChatAddGroupMemberList] getUsers getLoggedInUser error',
          error,
        );
      });
  };

  /**
   * updates the memberToAdd by change observed via user object is passed to and managed by CometChatAddGroupMemberListItem.
   * @param user: Userobject
   * @param userState
   */

  membersUpdated = (user, userState) => {
    this.setState({
      onToggle: !this.state.onToggle,
    });
    console.log('ccccc', this.state.membersToAdd);
    console.log('new', user);
    if (userState) {
      const members = [];
      members.push(user);
      this.setState({ membersToAdd: [...members] });
    } else {
      const membersToAdd = [...this.state.membersToAdd];
      const indexFound = membersToAdd.findIndex(
        (member) => member.uid === user.uid,
      );
      if (indexFound > -1) {
        membersToAdd.splice(indexFound, 1);
        this.setState({ membersToAdd: [...membersToAdd] });
      }
    }
  };

  /**
   * updates / add members to the group.
   * @param
   */

  updateMembers = () => {
    if (this.props.workspace) {
      this.setState({
        isLoader: true,
      });

      const { guid } = this.props.item;
      const userDetail = this.state.membersToAdd[0];
      console.log('here', this.state.membersToAdd);
      console.log('group detail:', this.props.item);

      CometChat.transferGroupOwnership(guid, userDetail.uid).then(
        (response) => {
          this.setState({
            isLoader: false,
          });
          console.log(
            'Successfully transferred ownership of the group.',
            response,
          );
          Alert.alert(
            'Success',
            'Successfully transferred ownership of the group.',
            [{ text: 'OK', onPress: () => this.props.close() }],
          );
        },
        (error) => {
          this.setState({
            isLoader: false,
          });
          console.log('Could not transfer ownership of the group: ', error);
          Alert.alert('Group leaving failed with exception', error.message, [
            { text: 'OK', onPress: () => console.log('OK Pressed') },
          ]);
        },
      );
    }
  };

  /**
   * Header component for flatlist.
   * @param
   */

  listHeaderComponent = () => {
    return (
      <View style={[style.contactHeaderStyle]}>
        <Text style={style.contactHeaderTitleStyle}>Add Members</Text>
      </View>
    );
  };

  /**
   * component to display when the flatlist seems empty i.e show the decorator message.
   * @param
   */

  listEmptyContainer = () => {
    return (
      <View style={style.contactMsgStyle}>
        <Text
          style={[
            style.contactMsgTxtStyle,
            {
              color: `${this.theme.color.secondary}`,
            },
          ]}>
          {this.decoratorMessage}
        </Text>
      </View>
    );
  };

  /**
   * to be displayed as a seperator within 2 components
   * @param
   */

  itemSeparatorComponent = ({ leadingItem }) => {
    return (
      <View
        style={[
          style.itemSeparatorStyle,
          {
            borderBottomColor: this.theme.borderColor.primary,
          },
        ]}
      />
    );
  };

  endReached = () => {
    // this.getUsers();
  };

  render() {
    const group = this.context;

    let currentLetter = '';
    const filteredUserList = this.state.filteredList.filter((item) => {
      return (
        item.name
          ?.toLowerCase()
          .indexOf(this.state.textInputValue.toLowerCase()) !== -1
      );
    });

    return (
      <React.Fragment>
        <Modal
          transparent={this.props.workspace ? false : true}
          animated
          animationType="fade"
          visible={this.props.open}>
          {/* <BottomSheet
            ref={this.sheetRef}
            snapPoints={[Dimensions.get('window').height - 90, 0]}
            borderRadius={30}
            initialSnap={0}
            enabledInnerScrolling={false}
            enabledContentTapInteraction
            overdragResistanceFactor={10}
            renderContent={() => {
              return ( */}
          <View style={style.reactionDetailsContainer}>
            <View style={style.headerContainer}>
              <View style={{}}>
                <Text style={style.contactHeaderTitleStyle}>Group Members</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  // this.sheetRef.current.snapTo(1);
                  this.props.close();
                }}
                style={{}}>
                <Text style={{ color: this.theme.color.blue }}>Close</Text>
              </TouchableOpacity>
            </View>
            <TouchableWithoutFeedback
              onPress={() => this.textInputRef.current.focus()}>
              <View
                style={[
                  style.contactSearchStyle,
                  {
                    backgroundColor: `${this.theme.backgroundColor.grey}`,
                  },
                ]}>
                <Icon
                  name="search"
                  size={15}
                  color={this.theme.color.helpText}
                />
                <TextInput
                  ref={this.textInputRef}
                  autoCompleteType="off"
                  value={this.state.textInputValue}
                  placeholder="Search"
                  placeholderTextColor={this.theme.color.textInputPlaceholder}
                  onChangeText={this.searchUsers}
                  onFocus={() => {
                    this.setState({ textInputFocused: true });
                  }}
                  onBlur={() => {
                    this.setState({ textInputFocused: false });
                  }}
                  clearButtonMode="always"
                  numberOfLines={1}
                  style={[
                    style.contactSearchInputStyle,
                    {
                      color: `${this.theme.color.primary}`,
                    },
                  ]}
                />
              </View>
            </TouchableWithoutFeedback>
            <FlatList
              key={this.state.onToggle}
              keyExtractor={(item, index) => item.uid + '_' + index}
              data={filteredUserList}
              renderItem={({ item }) => {
                const chr = item.name[0].toUpperCase();
                let firstLetter = null;
                if (chr !== currentLetter) {
                  currentLetter = chr;
                  firstLetter = currentLetter;
                }

                return (
                  <React.Fragment key={item.uid}>
                    <CometChatAddGroupMemberListItem
                      theme={this.theme}
                      firstLetter={firstLetter}
                      loggedinuser={group.loggedinuser}
                      user={item}
                      membersToAdd={this.state.membersToAdd}
                      members={group.memberList}
                      changed={this.membersUpdated}
                    />
                  </React.Fragment>
                );
              }}
              ListEmptyComponent={this.listEmptyContainer}
              ItemSeparatorComponent={this.itemSeparatorComponent}
              onScroll={this.handleScroll}
              onEndReached={this.endReached}
              onEndReachedThreshold={0.3}
              showsVerticalScrollIndicator={false}
            />
            <TouchableOpacity
              disabled={this.state.membersToAdd.length > 0 ? false : true}
              style={[
                style.addBtnStyle,
                {
                  backgroundColor:
                    this.state.membersToAdd.length > 0
                      ? this.theme.backgroundColor.blue
                      : 'gray',
                },
              ]}
              onPress={this.updateMembers}>
              {this.state.isLoader ? (
                <ActivityIndicator size="small" color="#ffff" />
              ) : (
                <Text
                  style={[
                    style.addBtnTxtStyle,
                    {
                      color: `${this.theme.color.white}`,
                    },
                  ]}>
                  Transfer
                </Text>
              )}
            </TouchableOpacity>
          </View>
          {/* );
            }}
            onCloseEnd={() => {
              this.props.close();
            }}
          /> */}
          <DropDownAlert ref={(ref) => (this.dropDownAlertRef = ref)} />
        </Modal>
      </React.Fragment>
    );
  }
}

export default GroupMembersList;
