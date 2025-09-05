import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import LargeButton from '../components/LargeButton';

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sri Lankan Sign Language Assistant</Text>

      <View style={styles.row}>
        <LargeButton text="Text → Sign" onPress={() => navigation.navigate('TextToSign')} />
        <LargeButton text="Sign → Text" onPress={() => navigation.navigate('SignToText')} />
      </View>

      <Text style={styles.note}>
        An offline-first app for communication between mute and non-mute persons.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex:1, justifyContent:'center', alignItems:'center', padding:20 },
  title: { fontSize:22, fontWeight:'700', marginBottom:32, textAlign:'center' },
  row: { flexDirection:'row', gap:16 },
  note: { marginTop:24, textAlign:'center', color:'#777', fontSize:14 },
});
