import React from 'react';
import { Dimensions, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
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
}) => {
  const visibleHeight = ITEM_HEIGHT * (type === 'period' ? 2 : 3);

  return (
    <FlatList
      ref={refList}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Pressable
          style={[styles.item, { height: ITEM_HEIGHT, width: ITEM_WIDTH }]}
          onPress={() => {
            // scroll to the selected item
            refList.current.scrollToIndex({
              index: data.findIndex((dataItem) => dataItem === item),
              animated: true,
            });
          }}
        >
          <Text style={styles.text}>{item}</Text>
        </Pressable>
      )}
      showsVerticalScrollIndicator={false}
      onScroll={(e) => updateSelection(e, data, setSelectedItem, type, periods, setSelectedPeriod)}
      snapToAlignment='center'
      snapToInterval={ITEM_HEIGHT}
      decelerationRate='fast'
      style={[styles.list, { height: visibleHeight }]}
      contentContainerStyle={{
        paddingTop: (visibleHeight - ITEM_HEIGHT) / 2,
        paddingBottom: (visibleHeight - ITEM_HEIGHT) / 2,
      }}
      initialScrollIndex={data.findIndex((item) => item === selectedItem)}
      getItemLayout={(data, index) => ({
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * index,
        index,
      })}
    />
  );
};

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
    // ignore the event if the data is empty
    if (data.length === 0) {
      return;
    }

    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const selectedItem = data[index % data.length];
    if (selectedItem === undefined) return;
    setState(selectedItem);
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          height: 40,
          width: '100%',
          borderWidth: 2,
          position: 'absolute',
          top: 40,
          borderRadius: 10,
          borderColor: '#557186',
          left: 0,
        }}
      ></View>
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
      {/* Render the colon between hour and minute selectors */}
      <View style={styles.colonContainer}>
        <Text style={styles.colon}>:</Text>
      </View>
      <ScrollPicker
        data={minutes}
        refList={minuteListRef}
        selectedItem={selectedMinute}
        setSelectedItem={setSelectedMinute}
        updateSelection={updateSelectionFromScroll}
      />
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
    position: 'relative',
    width: '90%',
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
  colonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  colon: {
    fontSize: 28,
    color: 'white',
  },
});

export default TimePicker;
