import React from 'react';
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import styles from './style';

const CustomPicker = (props) => {
  const { value, onChangeHandler, data } = props;
  return (
    <Picker
      mode="dropdown"
      style={styles.pickerInput}
      selectedValue={value}
      onValueChange={onChangeHandler}>
      {data.map((item, index) => (
        <Picker.Item label={item.label} value={item.value} key={index} />
      ))}
    </Picker>
  );
};

export default CustomPicker;
