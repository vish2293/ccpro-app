import React, { useState, useContext, useEffect, useRef } from 'react';
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import IonIcon from 'react-native-vector-icons/Ionicons';
import MCIIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import * as actions from '../../../utils/actions';
import * as enums from '../../../utils/enums';
import { CometChat } from '@cometchat-pro/react-native-chat';
import { CometChatContext } from '../../../utils/CometChatContext';
import Clipboard from '@react-native-clipboard/clipboard';
import Toast from 'react-native-easy-toast';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Share from 'react-native-share';
import { useSelector } from 'react-redux';

const actionIconSize = 26;

export default (props) => {
  const [restrictions, setRestrictions] = useState(null);
  let toastRef = useRef(null);
  const uid = useSelector((state) => state.reducer.user.uid);
  const context = useContext(CometChatContext);
  useEffect(() => {
    checkRestrictions();
  }, []);

  const checkRestrictions = async () => {
    let enableEditMessage = await context.FeatureRestriction.isEditMessageEnabled();
    let enableThreadedChats = await context.FeatureRestriction.isThreadedMessagesEnabled();
    let enableDeleteMessage = await context.FeatureRestriction.isDeleteMessageEnabled();
    let enableDeleteMessageForModerator = await context.FeatureRestriction.isDeleteMemberMessageEnabled();
    let enableMessageInPrivate = await context.FeatureRestriction.isMessageInPrivateEnabled();

    if (
      !enableEditMessage &&
      !enableThreadedChats &&
      !enableDeleteMessage &&
      !enableDeleteMessageForModerator &&
      !enableMessageInPrivate
    ) {
      props.actionGenerated(actions.CLOSE_MESSAGE_ACTIONS);
    }
    setRestrictions({
      enableEditMessage,
      enableThreadedChats,
      enableDeleteMessage,
      enableDeleteMessageForModerator,
      enableMessageInPrivate,
    });
  };

  const onCopy = () => {
    console.log('copy message:', props.message.text);
    Clipboard.setString(props.message.text);
    toastRef.show('Copied!', 500);
  };

  const onShare = () => {
    console.log('copy message:', props.message);

    const options = {
      url: props.message.data.url,
    };

    Share.open(options)
      .then((res) => {
        console.log('shared:', res);
      })
      .catch((err) => {
        err && console.log(err);
      });
  };

  let sendMessage = null;
  if (
    props.message.messageFrom === enums.MESSAGE_FROM_RECEIVER &&
    props.message.receiverType === CometChat.RECEIVER_TYPE.GROUP &&
    restrictions?.enableMessageInPrivate
  ) {
    sendMessage = (
      <TouchableOpacity
        style={styles.action}
        onPress={() =>
          props.actionGenerated(actions.SEND_MESSAGE, props.message)
        }>
        <FeatherIcon name="message-circle" size={actionIconSize} />
        <Text style={styles.actionsText}>Send Message Privately</Text>
      </TouchableOpacity>
    );
  }
  let threadedChats = (
    <TouchableOpacity
      style={styles.action}
      onPress={() =>
        props.actionGenerated(actions.VIEW_MESSAGE_THREAD, props.message)
      }>
      <FeatherIcon name="message-circle" size={actionIconSize} />
      <Text style={styles.actionsText}>Start Thread</Text>
    </TouchableOpacity>
  );

  // if threaded messages need to be disabled
  if (
    props.message.category === CometChat.CATEGORY_CUSTOM ||
    props.message.parentMessageId ||
    !restrictions?.enableThreadedChats
  ) {
    threadedChats = null;
  }

  let deleteMessage = (
    <TouchableOpacity
      style={styles.action}
      onPress={() =>
        props.actionGenerated(actions.DELETE_MESSAGE, props.message)
      }>
      <IonIcon name="ios-trash-outline" size={actionIconSize} color="red" />
      <Text style={styles.actionsText}>Delete message</Text>
    </TouchableOpacity>
  );

  // if deleting messages need to be disabled

  if (
    props.message.messageFrom === enums.MESSAGE_FROM_RECEIVER &&
    (props.item.scope == CometChat.GROUP_MEMBER_SCOPE.MODERATOR ||
    props.item.scope == CometChat.GROUP_MEMBER_SCOPE.ADMIN
      ? !restrictions?.enableDeleteMessageForModerator
      : !restrictions?.enableDeleteMessage)
  ) {
    deleteMessage = null;
  }
  let editMessage = (
    <TouchableOpacity
      style={styles.action}
      onPress={() =>
        props.actionGenerated(actions.EDIT_MESSAGE, props.message)
      }>
      <MCIIcon name="square-edit-outline" size={actionIconSize} />
      <Text style={styles.actionsText}>Edit message</Text>
    </TouchableOpacity>
  );

  let copyMessage = (
    <TouchableOpacity style={styles.action} onPress={onCopy}>
      <IonIcon name="copy-outline" size={actionIconSize} />
      <Text style={styles.actionsText}>Copy Text</Text>
    </TouchableOpacity>
  );

  let shareMessage = (
    <TouchableOpacity style={styles.action} onPress={onShare}>
      <AntDesign name="sharealt" size={actionIconSize} />
      <Text style={styles.actionsText}>Share</Text>
    </TouchableOpacity>
  );

  let deleteButton = (
    <TouchableOpacity
      style={styles.action}
      onPress={() =>
        props.actionGenerated(actions.DELETE_MESSAGE, props.message)
      }>
      <IonIcon name="ios-trash-outline" size={actionIconSize} color="red" />
      <Text style={styles.actionsText}>Delete message</Text>
    </TouchableOpacity>
  );

  // if editing messages need to be disabled
  if (
    props.message.messageFrom === enums.MESSAGE_FROM_RECEIVER ||
    props.message.type !== CometChat.MESSAGE_TYPE.TEXT ||
    !restrictions?.enableEditMessage
  ) {
    editMessage = null;
  }

  if (props.message.type !== CometChat.MESSAGE_TYPE.TEXT) {
    copyMessage = null;
  }

  if (props.message.messageFrom === enums.MESSAGE_FROM_RECEIVER) {
    deleteMessage = null;
  }

  return (
    <>
      <TouchableWithoutFeedback onPress={() => {}}>
        <View style={styles.actionsContainer}>
          {sendMessage}
          {threadedChats}
          {editMessage}
          {deleteMessage}
          {copyMessage}
          {props.message.type === 'text' ? null : shareMessage}
          {props.message.type === 'extension_sticker' &&
          props.message.sender.uid === uid
            ? deleteButton
            : null}
        </View>
      </TouchableWithoutFeedback>
      <Toast
        style={{ backgroundColor: 'rgba(0,0,0, 0.7)' }}
        position="top"
        fadeInDuration={750}
        fadeOutDuration={1000}
        // opacity={0.8}
        ref={(toast) => (toastRef = toast)}
      />
    </>
  );
};
