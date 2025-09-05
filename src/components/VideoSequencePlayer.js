import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Video } from 'expo-av';
import * as Asset from 'expo-asset';

export default function VideoSequencePlayer({ files, onDone }) {
  const [index, setIndex] = useState(0);
  const videoRef = useRef(null);

  useEffect(() => { setIndex(0); }, [files]);

  useEffect(() => {
    if (!files || files.length === 0) return;
    (async () => {
      const asset = Asset.Asset.fromModule(files[index]);
      await asset.downloadAsync();
      // Play will be triggered via ref when loaded
    })();
  }, [index, files]);

  if (!files || files.length === 0) {
    return <Text style={styles.info}>No videos to play</Text>;
  }

  const handleEnd = async () => {
    const next = index + 1;
    if (next < files.length) setIndex(next);
    else onDone && onDone();
  };

  return (
    <View>
      <Video
        key={files[index]}
        ref={videoRef}
        style={styles.video}
        source={files[index]}
        resizeMode="contain"
        shouldPlay
        isLooping={false}
        onPlaybackStatusUpdate={(s) => {
          // auto-play when ready
          if (s.isLoaded && !s.isPlaying && s.positionMillis === 0) {
            videoRef.current?.playAsync();
          }
          if (s.didJustFinish) handleEnd();
        }}
      />
      <Text style={styles.caption}>{`Clip ${index + 1} / ${files.length}`}</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  video: { width: 320, height: 240, backgroundColor:'#000', borderRadius:12 },
  caption: { textAlign:'center', marginTop:6 },
  info: { textAlign:'center', color:'#666' },
});
