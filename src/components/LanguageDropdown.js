import React from 'react';
import { Picker } from '@react-native-picker/picker';

export default function LanguageDropdown({ selected, onChange }) {
  return (
    <Picker selectedValue={selected} onValueChange={onChange} style={{ height: 44 }}>
      <Picker.Item label="English" value="en" />
      <Picker.Item label="සිංහල (Sinhala)" value="si" />
      <Picker.Item label="தமிழ் (Tamil)" value="ta" />
    </Picker>
  );
}
