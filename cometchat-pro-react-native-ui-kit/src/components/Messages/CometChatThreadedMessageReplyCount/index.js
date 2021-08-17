import React, { useEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import theme from '../../../resources/theme';
import styles from './styles';
import * as actions from '../../../utils/actions';

const CometChatThreadedMessageReplyCount = (props) => {
  const replyTheme = { ...theme, ...props.theme };

  const { replyCount } = props.message;
  const replyText =
    replyCount === 1 ? `${replyCount} reply` : `${replyCount} replies`;

  const onClickReply = () => {
    console.log('Hi me calling...');
    console.log('message::', props.message);
    if (props.customAction) {
      props.customAction(actions.VIEW_MESSAGE_THREAD, props.message);
    } else {
      props.actionGenerated(actions.VIEW_MESSAGE_THREAD, props.message);
    }
    // console.log(
    //   'check function',
    //   props.actionGenerated(actions.VIEW_MESSAGE_THREAD, props.message),
    // );
    // props.actionGenerated(actions.VIEW_MESSAGE_THREAD, props.message)
  };

  let replies = (
    <TouchableOpacity onPress={onClickReply}>
      <Text
        style={[
          styles.replyTextStyle,
          {
            color: replyTheme.color.blue,
          },
        ]}>
        {replyText}
      </Text>
    </TouchableOpacity>
  );

  if (
    Object.prototype.hasOwnProperty.call(props.message, 'replyCount') === false
  ) {
    replies = null;
  }

  return replies;
};
export default CometChatThreadedMessageReplyCount;
