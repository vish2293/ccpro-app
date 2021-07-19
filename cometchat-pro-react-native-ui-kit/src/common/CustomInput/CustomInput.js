import React from 'react';
import { TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './style';

const CustomInput = (props) => {
  const { name, onChangeHandler, multiline, customStyle } = props;
  return (
    <TextInput
      value={name}
      onChangeText={onChangeHandler}
      style={[styles.textInput, customStyle]}
      multiline={multiline ? true : false}
      numberOfLines={multiline ? 5 : undefined}
    />
  );
};

export default CustomInput;
