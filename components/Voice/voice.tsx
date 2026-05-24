import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import Voice from '@react-native-voice/voice';

const VoiceRe = () => {
  const [isListening, setIsListening] = useState(false);
  const [resultText, setResultText] = useState('');

  useEffect(() => {
    Voice.onSpeechResults = onSpeechResults;
    Voice.onSpeechError = onSpeechError;

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  const startListening = async () => {
    try {
      setIsListening(true);
      await Voice.start('en-US'); // You can change 'en-US' to your preferred language
    } catch (error) {
      console.error('Error starting speech recognition:', error);
    }
  };

  const stopListening = async () => {
    try {
      setIsListening(false);
      await Voice.stop();
    } catch (error) {
      console.error('Error stopping speech recognition:', error);
    }
  };

  const onSpeechResults = (event: any) => {
    setResultText(event.value[0]);
  };

  const onSpeechError = (error: any) => {
    console.error('Speech recognition error:', error);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Voice</Text>
      <Text style={styles.resultText}>{resultText || 'Speak something...'}</Text>
      <Button
        title={isListening ? 'Stop Listening' : 'Start Listening'}
        onPress={isListening ? stopListening : startListening}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  resultText: {
    fontSize: 18,
    textAlign: 'center',
    marginVertical: 20,
  },
});

export default VoiceRe;
