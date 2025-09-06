import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ToastAndroid,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import * as Speech from 'expo-speech';

import LargeButton from '../components/LargeButton';
import VideoSequencePlayer from '../components/VideoSequencePlayer';
import { sentenceToVideos } from '../logic/textToSign';
import { LOCAL_TO_EN } from '../logic/localToEnglish';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function TextToSignScreen() {
  const [text, setText] = useState('');
  const [lang, setLang] = useState('en');
  const [sequence, setSequence] = useState([]);

  const handleTranslate = () => {
    // Split input into words
    const words = text.trim().split(/\s+/);

    // Convert Sinhala/Tamil words to English if needed
    const convertedWords = words.map((w) => {
      if (lang !== 'en') {
        const lookup = LOCAL_TO_EN[lang] || {};
        return lookup[w] || w; // fallback to original if no mapping
      }
      return w;
    });

    // Get video files for words
    const files = sentenceToVideos(convertedWords.join(' '));

    // Force reset to re-render VideoSequencePlayer
    setSequence([]);
    setTimeout(() => setSequence(files), 0);
  };

  const handleSpeak = () => {
    const speechOptions = { language: lang, pitch: 1.0, rate: 1.0 };
    if (text.trim() === '') return;

    Speech.speak(text, speechOptions);

    setTimeout(() => {
      Speech.getAvailableVoicesAsync().then((voices) => {
        const hasVoice = voices.some((v) => v.language.startsWith(lang));
        if (!hasVoice) {
          ToastAndroid.show(
            `Voice for ${lang} not available on this device`,
            ToastAndroid.LONG
          );
        }
      });
    }, 500);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.top}>

        <View style={styles.row}>
          <Text style={styles.label}>Language:</Text>
          <Picker selectedValue={lang} style={styles.picker} onValueChange={setLang}>
            <Picker.Item label="English" value="en" />
            <Picker.Item label="සිංහල (Sinhala)" value="si" />
            <Picker.Item label="தமிழ் (Tamil)" value="ta" />
          </Picker>
        </View>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Type a sentence..."
          value={text}
          onChangeText={setText}
        />

        <View style={styles.row}>
          <LargeButton
            text="Translate"
            icon={<MaterialIcons name="translate" size={24} color="white" />}
            onPress={handleTranslate}
          />

          <LargeButton
            text="Speak"
            icon={<FontAwesome name="volume-up" size={24} color="white" />}
            onPress={handleSpeak}
          />
        </View>
      </View>

      <View style={styles.player}>
        <VideoSequencePlayer files={sequence} onDone={() => {}} />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff', alignItems: 'center', paddingTop: '50' },
  top: { gap: 12 },
  title: { fontSize: 20, fontWeight: '700', textAlign: 'center', marginBottom: 6 },
  row: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 15 },
  label: { fontWeight: '600' },
  picker: { flex: 1 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    fontSize: 16,
  },
  player: { marginTop: 16, alignItems: 'center' },
});
