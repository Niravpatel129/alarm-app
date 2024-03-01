import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const ITEM_HEIGHT = 40; // Adjust this based on your item's height
const ITEM_WIDTH = width / 4; // Adjust this based on your layout preferences

const TimePicker = ({ onTimeChange }) => {
  // Reference for the FlatList components
  const hourListRef = useRef(null);
  const minuteListRef = useRef(null);
  const periodListRef = useRef(null);

  const now = new Date();
  now.setMinutes(now.getMinutes() + 1); // Add one minute to the current time

  const formatHour = (hour) => `${hour % 12 === 0 ? 12 : hour % 12}`.padStart(2, '0');
  const initialHour = formatHour(now.getHours());
  const initialMinute = `${now.getMinutes()}`.padStart(2, '0');
  const initialPeriod = now.getHours() < 12 ? 'AM' : 'PM';

  const [selectedHour, setSelectedHour] = useState(initialHour);
  const [selectedMinute, setSelectedMinute] = useState(initialMinute);
  const [selectedPeriod, setSelectedPeriod] = useState(initialPeriod);

  const hours = Array.from({ length: 24 }, (_, i) => ((i % 12) + 1).toString().padStart(2, '0'));

  const minutes = Array.from({ length: 60 }, (_, i) => (i % 60).toString().padStart(2, '0'));

  const periods = ['AM', 'PM'];

  useEffect(() => {
    console.log('Initial time:', `${selectedHour}:${selectedMinute} ${selectedPeriod}`);
    // Automatically adjust the initial scroll position for hour, minute, and period
    const hourIndex = hours.findIndex((item) => item === initialHour);
    const minuteIndex = minutes.findIndex((item) => item === initialMinute);
    const periodIndex = periods.findIndex((item) => item === initialPeriod);

    if (hourListRef.current) {
      hourListRef.current.scrollToIndex({ index: hourIndex, animated: false });
    }
    if (minuteListRef.current) {
      minuteListRef.current.scrollToIndex({ index: minuteIndex, animated: false });
    }
    if (periodListRef.current) {
      periodListRef.current.scrollToIndex({ index: periodIndex, animated: false });
    }

    // Update the parent component about the initial time
    onTimeChange(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
  }, []);

  useEffect(() => {
    onTimeChange(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
  }, [selectedHour, selectedMinute, selectedPeriod]);

  const updateSelectionFromScroll = (event, data, setState) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const selectedItem = data[index % data.length];
    setState(selectedItem);
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { height: ITEM_HEIGHT, width: ITEM_WIDTH }]}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View
        style={{
          position: 'absolute',
          top: 21,
          left: 0,
          right: 0,
          height: 40,
          borderWidth: 3,
          borderColor: '#1c3440',
          borderRadius: 7,
        }}
      ></View>
      {/* Hours list */}
      <FlatList
        ref={hourListRef}
        data={hours}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => updateSelectionFromScroll(e, hours, setSelectedHour)}
        snapToAlignment='center'
        snapToInterval={ITEM_HEIGHT}
        decelerationRate='fast'
        style={[styles.list, { height: 3 * ITEM_HEIGHT }]}
        contentContainerStyle={styles.centerContent}
        numColumns={1}
        initialScrollIndex={hours.findIndex((item) => item === initialHour)}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      <View
        style={{
          position: 'absolute',
          top: 20,
          left: 100,
        }}
      >
        <Text
          style={{
            color: 'white',
            fontSize: 28,
            textAlign: 'center',
          }}
        >
          :
        </Text>
      </View>
      {/* Minutes list */}
      <FlatList
        ref={minuteListRef}
        data={minutes}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => updateSelectionFromScroll(e, minutes, setSelectedMinute)}
        snapToAlignment='center'
        snapToInterval={ITEM_HEIGHT}
        decelerationRate='fast'
        style={[styles.list, { height: 3 * ITEM_HEIGHT }]}
        contentContainerStyle={styles.centerContent}
        numColumns={1}
        initialScrollIndex={minutes.findIndex((item) => item === initialMinute)}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      {/* Periods list */}
      <FlatList
        ref={periodListRef}
        data={periods}
        keyExtractor={(item) => item}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => updateSelectionFromScroll(e, periods, setSelectedPeriod)}
        snapToAlignment='center'
        snapToInterval={ITEM_HEIGHT}
        decelerationRate='fast'
        style={[styles.list, { height: 2 * ITEM_HEIGHT, marginBottom: 42 }]}
        contentContainerStyle={styles.centerContent}
        numColumns={1}
        initialScrollIndex={periods.findIndex((item) => item === initialPeriod)}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    flexGrow: 0,
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 28,
    color: 'white',
  },
  centerContent: {
    paddingTop: ITEM_HEIGHT / 2,
    paddingBottom: ITEM_HEIGHT / 2,
  },
});

export default TimePicker;
