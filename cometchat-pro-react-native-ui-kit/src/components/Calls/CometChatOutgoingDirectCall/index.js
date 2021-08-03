import React from 'react';
import { Text, View, Modal, TouchableOpacity } from 'react-native';
import { CometChat } from '@cometchat-pro/react-native-chat';
import * as actions from '../../../utils/actions';
import KeepAwake from 'react-native-keep-awake';
import * as enums from '../../../utils/enums';
import { theme } from '../../../resources/theme';
import style from './style';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialIcons';

class CometChatOutgoingDirectCall extends React.Component {
  sessionID;

  constructor(props) {
    super(props);
    this.sessionID = `${props.item.guid}`;
    this.state = {
      callSettings: null,
    };
  }

  componentDidMount() {
    this.startCall();
  }

  getReceiverDetails = () => {
    let receiverId;
    let receiverType;

    if (this.props.type === CometChat.RECEIVER_TYPE.USER) {
      receiverId = this.props.item.uid;
      receiverType = CometChat.RECEIVER_TYPE.USER;
    } else if (this.props.type === CometChat.RECEIVER_TYPE.GROUP) {
      receiverId = this.props.item.guid;
      receiverType = CometChat.RECEIVER_TYPE.GROUP;
    }

    return { receiverId: receiverId, receiverType: receiverType };
  };

  sendCustomMessage = () => {
    const { receiverId, receiverType } = this.getReceiverDetails();

    const customData = {
      sessionID: this.sessionID,
      callType: this.props.callType,
    };
    const customType = enums.CUSTOM_TYPE_MEETING;

    let conversationId = null;
    if (this.props.type === CometChat.RECEIVER_TYPE.USER) {
      const users = [this.props.loggedInUser.uid, this.props.item.uid];
      conversationId = users.sort().join('_user_');
    } else if (this.props.type === CometChat.RECEIVER_TYPE.GROUP) {
      conversationId = `group_${this.props.item.guid}`;
    }

    const customMessage = new CometChat.CustomMessage(
      receiverId,
      receiverType,
      customType,
      customData,
    );
    customMessage.setSender(this.props.loggedInUser);
    customMessage.setReceiver(this.props.type);
    customMessage.setConversationId(conversationId);
    customMessage._composedAt = Math.round(+new Date() / 1000);
    customMessage._id = '_' + Math.random().toString(36).substr(2, 9);

    this.props.actionGenerated(actions['MESSAGE_COMPOSED'], [customMessage]);
    CometChat.sendCustomMessage(customMessage)
      .then((message) => {
        const newMessageObj = { ...message, _id: customMessage._id };
        this.props.actionGenerated(actions['MESSAGE_SENT'], newMessageObj);
      })
      .catch((error) => {
        console.log('custom message sending failed with error', error);

        const newMessageObj = { ...customMessage, error: error };
        this.props.actionGenerated(
          actions['ERROR_IN_SENDING_MESSAGE'],
          newMessageObj,
        );
      });
  };

  startCall = () => {
    let sessionID = `${this.props.item.guid}`;
    let audioOnly = false;
    let defaultLayout = false;
    let callListener = new CometChat.OngoingCallListener({
      onCallEnded: (call) => {
        console.log('On End call:::', call);
        this.props.close();
      },
      onError: (error) => {
        this.props.actionGenerated(actions.CALL_ERROR, error);

        console.log('Call Error: ', error);
      },
    });

    let callSettings = new CometChat.CallSettingsBuilder()
      .enableDefaultLayout(defaultLayout)
      .setSessionID(sessionID)
      .setIsAudioOnlyCall(audioOnly)
      .setCallEventListener(callListener)
      .build();
    this.setState({ callSettings });
    //send custom message only when someone starts a direct call
    if (this.props.joinDirectCall === false) {
      this.sendCustomMessage();
    }
  };

  endCall = () => {
    let sessionID = `${this.props.item.guid}`;
    CometChat.endCall(sessionID).then(
      (call) => {
        console.log('call ended', call);
        this.props.actionGenerated(actions.CALL_ENDED, call);
        this.setState({
          callSettings: null,
        });
        this.props.close();
      },
      (error) => {
        console.log('Mine error', error);
      },
    );
  };

  onSwitchCamera = () => {
    let callController = CometChat.CallController.getInstance();
    callController.switchCamera();
  };

  onMute = () => {
    let callController = CometChat.CallController.getInstance();
    callController.muteAudio(!this.state.muteAudio);
    this.setState({
      muteAudio: !this.state.muteAudio,
    });
  };

  onPauseVideo = () => {
    let callController = CometChat.CallController.getInstance();
    callController.pauseVideo(!this.state.pauseVideo);
    this.setState({
      pauseVideo: !this.state.pauseVideo,
    });
  };

  render() {
    return (
      <Modal animated animationType="fade">
        <View style={{ height: '100%', width: '100%', position: 'relative' }}>
          <KeepAwake />
          {this.state.callSettings ? (
            <CometChat.CallingComponent
              callsettings={this.state.callSettings}
            />
          ) : null}

          <View style={style.footer}>
            <TouchableOpacity onPress={this.endCall} style={style.endBtn}>
              <Icon name="call-end" color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={this.onSwitchCamera}
              style={style.defaultBtn}>
              <Ionicons name="md-camera-reverse" color="#FFFFFF" size={22} />
            </TouchableOpacity>
            <TouchableOpacity onPress={this.onMute} style={style.defaultBtn}>
              {this.state.muteAudio ? (
                <FontAwesome
                  name="microphone-slash"
                  color="#FFFFFF"
                  size={22}
                />
              ) : (
                <FontAwesome name="microphone" color="#FFFFFF" size={22} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={this.onPauseVideo}
              style={style.defaultBtn}>
              {this.state.pauseVideo ? (
                <Icon name="videocam-off" color="#FFFFFF" size={22} />
              ) : (
                <Icon name="videocam" color="#FFFFFF" size={22} />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  }
}

export default CometChatOutgoingDirectCall;
