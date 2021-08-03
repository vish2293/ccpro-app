import React, { useEffect } from 'react';
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
import RNPickerSelect from 'react-native-picker-select';
import styles from './style';

const CustomPicker = (props) => {
  const { value, onChangeHandler, data } = props;

  useEffect(() => {
    console.log('dddddddd::::', data);
  }, []);

  return (
    <RNPickerSelect
      value={value}
      onValueChange={onChangeHandler}
      items={data}
      placeholder={{
        label: props.label ? props.label : 'Select workspace',
        value: '',
      }}
      style={{ color: '#000' }}
      pickerProps={{
        mode: 'dropdown',
        style: { color: '#000' },
      }}
    />
    // <Picker
    //   mode="dropdown"
    //   style={styles.pickerInput}
    //   selectedValue={value}
    //   onValueChange={onChangeHandler}>
    //   {data.map((item, index) => (
    //     <Picker.Item label={item.label} value={item.value} key={index} />
    //   ))}
    // </Picker>
  );
};

export default CustomPicker;
