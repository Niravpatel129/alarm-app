import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import useTimeSelection from '../../hooks/useTimeSelection';

const { width } = Dimensions.get('window');

const ITEM_HEIGHT = 40; // Adjust this based on your item's height
const ITEM_WIDTH = width / 4; // Adjust this based on your layout preferences

const TimePicker = ({ onTimeChange }) => {
  const {
    hourListRef,
    minuteListRef,
    periodListRef,
    selectedHour,
    setSelectedHour,
    selectedMinute,
    setSelectedMinute,
    selectedPeriod,
    setSelectedPeriod,
    hours,
    minutes,
    periods,
  } = useTimeSelection(onTimeChange);

  const updateSelectionFromScroll = (event, data, setState, type) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const selectedItem = data[index % data.length];
    setState(selectedItem);

    if (type === 'hour') {
      const isPM = index >= 12; // Assuming a 24-hour cycle represented in a 12-hour format
      const newPeriod = isPM ? 'PM' : 'AM';
      setSelectedPeriod(newPeriod);

      // Programmatically scroll the AM/PM FlatList to the correct position
      const periodIndex = periods.findIndex((period) => period === newPeriod); // Should be 0 for AM, 1 for PM
      if (periodListRef.current) {
        periodListRef.current.scrollToIndex({ index: periodIndex, animated: true });
      }
    }
  };

  const renderItem = ({ item }) => (
    <View style={[styles.item, { height: ITEM_HEIGHT, width: ITEM_WIDTH }]}>
      <Text style={styles.text}>{item}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={hourListRef}
        data={hours}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        onScroll={(e) => updateSelectionFromScroll(e, hours, setSelectedHour, 'hour')}
        snapToAlignment='center'
        snapToInterval={ITEM_HEIGHT}
        decelerationRate='fast'
        style={[styles.list, { height: 3 * ITEM_HEIGHT }]}
        contentContainerStyle={styles.centerContent}
        initialScrollIndex={hours.findIndex((item) => item === selectedHour)}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
      <Text style={styles.colon}>:</Text>
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
        initialScrollIndex={minutes.findIndex((item) => item === selectedMinute)}
        getItemLayout={(data, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
      />
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
        style={[styles.list, { height: 2 * ITEM_HEIGHT }]}
        contentContainerStyle={styles.centerContent}
        initialScrollIndex={periods.findIndex((item) => item === selectedPeriod)}
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
  colon: {
    color: 'white',
    fontSize: 28,
    alignSelf: 'center',
    paddingHorizontal: 10, // Adjust padding as needed for alignment
  },
});

export default TimePicker;
