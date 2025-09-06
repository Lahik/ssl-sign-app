import React, { useState, useEffect, useRef } from 'react';
import { 
  View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert 
} from 'react-native';
import { Camera } from 'expo-camera';
import * as Speech from 'expo-speech';
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

import { offlineTranslate } from '../logic/translator';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';

export default function SignToTextScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraOn, setCameraOn] = useState(false);
  const [predictedText, setPredictedText] = useState('');
  const [translatedTexts, setTranslatedTexts] = useState({ en: '', si: '', ta: '' });
  const [selectedTTSLang, setSelectedTTSLang] = useState('en');
  const cameraRef = useRef(null);

  // Request camera permission on mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // Placeholder: function to start sign language prediction
  const startPrediction = async () => {
    setPredictedText('');
    setTranslatedTexts({ en: '', si: '', ta: '' });
    setCameraOn(true);

    // TODO: Integrate ML model to start detecting signs from camera frames
    // For now, simulate detection after 5 seconds with dummy text
    setTimeout(() => {
      const dummyPrediction = "hello how you"; // example detected sentence
      onPredictionComplete(dummyPrediction);
      setCameraOn(false);
    }, 5000);
  };

  // Called when prediction is done
  const onPredictionComplete = (text) => {
    // Fix sentence - e.g. "hello how you" -> "hello how are you"
    const fixedText = fixSentence(text);

    // Translate offline to Sinhala and Tamil
    const siTranslation = offlineTranslate(fixedText, 'si');
    const taTranslation = offlineTranslate(fixedText, 'ta');

    setPredictedText(fixedText);
    setTranslatedTexts({ en: fixedText, si: siTranslation, ta: taTranslation });
  };

  // Simple sentence fixup example — can be expanded later
  const fixSentence = (text) => {
    return text.replace(/\bhow you\b/g, 'how are you');
  };

  // Text-to-speech handling
  const handleSpeak = () => {
    // Check if voice pack exists for selected language - Expo Speech API doesn't provide direct check
    // So we try to speak, if fails, show toast message - fallback behavior
    try {
      Speech.speak(translatedTexts[selectedTTSLang] || '', {
        language: selectedTTSLang,
        pitch: 1.0,
        rate: 1.0,
        onError: () => {
          Toast.show({
            type: 'error',
            text1: 'Voice pack missing',
            text2: `Voice pack for ${selectedTTSLang} is not installed.`,
            position: 'bottom',
          });
        },
      });
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Voice pack missing',
        text2: `Voice pack for ${selectedTTSLang} is not installed.`,
        position: 'bottom',
      });
    }
  };

  if (hasPermission === null) {
    return <View><Text>Requesting camera permission...</Text></View>;
  }
  if (hasPermission === false) {
    return <View><Text>No access to camera</Text></View>;
  }

  return (
    <View style={styles.container}>
      {/* Camera preview */}
      <View style={styles.cameraContainer}>
        {cameraOn ? (
          <Camera style={styles.camera} type={Camera.Constants.Type.front} ref={cameraRef} />
        ) : (
          <View style={styles.cameraPlaceholder}>
            <Text style={{ color: '#999' }}>Camera off</Text>
          </View>
        )}
      </View>

      {/* Buttons to start/stop recording */}
      <View style={styles.buttonRow}>
        {!cameraOn ? (
          <TouchableOpacity style={styles.button} onPress={startPrediction}>
            <MaterialIcons name="camera-alt" size={24} color="white" />
            <Text style={styles.buttonText}>Start Sign Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={() => setCameraOn(false)}
          >
            <MaterialIcons name="stop" size={24} color="white" />
            <Text style={styles.buttonText}>Stop</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Output text fields */}
      <View style={styles.outputContainer}>
        <Text style={styles.outputLabel}>Predicted Text (English):</Text>
        <TextInput
          style={styles.outputField}
          value={translatedTexts.en}
          editable={false}
          multiline
        />

        <Text style={styles.outputLabel}>Sinhala:</Text>
        <TextInput
          style={styles.outputField}
          value={translatedTexts.si}
          editable={false}
          multiline
        />

        <Text style={styles.outputLabel}>Tamil:</Text>
        <TextInput
          style={styles.outputField}
          value={translatedTexts.ta}
          editable={false}
          multiline
        />
      </View>

      {/* TTS controls */}
      <View style={styles.ttsRow}>
        <Picker
          selectedValue={selectedTTSLang}
          style={styles.picker}
          onValueChange={setSelectedTTSLang}
        >
          <Picker.Item label="English" value="en" />
          <Picker.Item label="සිංහල (Sinhala)" value="si" />
          <Picker.Item label="தமிழ் (Tamil)" value="ta" />
        </Picker>

        <TouchableOpacity style={styles.speakButton} onPress={handleSpeak}>
          <MaterialIcons name="volume-up" size={24} color="white" />
          <Text style={styles.buttonText}>Speak</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 12,
    textAlign: 'center',
  },
  cameraContainer: {
    height: 280,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#000',
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: '100%',
  },
  cameraPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1f7ae0',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stopButton: {
    backgroundColor: '#d9534f',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  outputContainer: {
    marginVertical: 10
  },
  outputLabel: {
    fontWeight: '600',
    fontSize: 16,
    marginTop: 8,
  },
  outputField: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 12,
    minHeight: 50,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
  ttsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  picker: {
    flex: 1,
  },
  speakButton: {
    backgroundColor: '#1f7ae0',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
