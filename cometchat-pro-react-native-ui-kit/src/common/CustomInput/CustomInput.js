import React from 'react';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './style';

const CustomInput = (props) => {
  const { name, onChangeHandler, multiline } = props;
  return (
    <TextInput
      value={name}
      onChangeText={onChangeHandler}
      style={[styles.textInput, { textAlignVertical: 'top' }]}
      multiline={multiline ? true : false}
      numberOfLines={multiline ? 5 : undefined}
    />
  );
};

export default CustomInput;
