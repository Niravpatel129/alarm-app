import * as Speech from 'expo-speech';

const useTTS = () => {
  const speak = () => {
    const thingToSay = 'hello world';
    Speech.speak(thingToSay);
  };

  return {
    speak,
  };
};

export default useTTS;
