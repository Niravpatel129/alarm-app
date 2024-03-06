import * as Speech from 'expo-speech';

const useTTS = () => {
  const speak = () => {
    try {
      const thingToSay = 'hello world';
      Speech.speak(thingToSay);
    } catch (error) {
      console.log('Error speaking:', error);
    }
  };

  return {
    speak,
  };
};

export default useTTS;
