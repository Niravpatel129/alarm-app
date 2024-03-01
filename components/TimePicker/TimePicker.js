import React from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';
import useTimeSelection from '../../hooks/useTimeSelection';

const { width } = Dimensions.get('window');

const ITEM_HEIGHT = 40; // Adjust this based on your item's height
const ITEM_WIDTH = width / 4; // Adjust this based on your layout preferences

const ScrollPicker = ({
  data,
  refList,
  selectedItem,
  setSelectedItem,
  updateSelection,
  type,
  periods,
  setSelectedPeriod,
}) => (
  <FlatList
    ref={refList}
    data={data}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item }) => (
      <View style={[styles.item, { height: ITEM_HEIGHT, width: ITEM_WIDTH }]}>
        <Text style={styles.text}>{item}</Text>
      </View>
    )}
    showsVerticalScrollIndicator={false}
    onScroll={(e) => updateSelection(e, data, setSelectedItem, type, periods, setSelectedPeriod)}
    snapToAlignment='center'
    snapToInterval={ITEM_HEIGHT}
    decelerationRate='fast'
    style={[styles.list, { height: type === 'period' ? 2 * ITEM_HEIGHT : 3 * ITEM_HEIGHT }]}
    contentContainerStyle={styles.centerContent}
    initialScrollIndex={data.findIndex((item) => item === selectedItem)}
    getItemLayout={(data, index) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    })}
  />
);

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

  const updateSelectionFromScroll = (event, data, setState, type, periods, setSelectedPeriod) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const selectedItem = data[index % data.length];
    setState(selectedItem);

    if (type === 'hour') {
      const isPM = index >= 12; // Assuming a 24-hour cycle represented in a 12-hour format
      const newPeriod = isPM ? 'PM' : 'AM';
      setSelectedPeriod(newPeriod);

      // Programmatically scroll the AM/PM FlatList to the correct position
      const periodIndex = periods.findIndex((period) => period === newPeriod);
      if (periodListRef.current) {
        periodListRef.current.scrollToIndex({ index: periodIndex, animated: true });
      }
    }
  };

  return (
    <View style={styles.container}>
      <ScrollPicker
        data={hours}
        refList={hourListRef}
        selectedItem={selectedHour}
        setSelectedItem={setSelectedHour}
        updateSelection={updateSelectionFromScroll}
        type='hour'
        periods={periods}
        setSelectedPeriod={setSelectedPeriod}
      />

      <ScrollPicker
        data={minutes}
        refList={minuteListRef}
        selectedItem={selectedMinute}
        setSelectedItem={setSelectedMinute}
        updateSelection={updateSelectionFromScroll}
      />
      {/* Assuming periods (AM/PM) should be closely aligned with the minute picker */}
      <ScrollPicker
        data={periods}
        refList={periodListRef}
        selectedItem={selectedPeriod}
        setSelectedItem={setSelectedPeriod}
        updateSelection={updateSelectionFromScroll}
        type='period'
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
