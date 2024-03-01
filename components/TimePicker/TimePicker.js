import React, { useState } from 'react';
import { Dimensions, FlatList, StyleSheet, Text, View } from 'react-native';

const { width } = Dimensions.get('window');

const ITEM_HEIGHT = 40; // Adjust this based on your item's height
const ITEM_WIDTH = width / 4; // Adjust this based on your layout preferences

const TimePicker = ({ onTimeChange }) => {
  const [selectedHour, setSelectedHour] = useState('12');
  const [selectedMinute, setSelectedMinute] = useState('00');
  const [selectedPeriod, setSelectedPeriod] = useState('AM');

  const hours = Array.from({ length: 24 * 100 }, (_, i) =>
    ((i % 12) + 1).toString().padStart(2, '0'),
  );

  const minutes = Array.from({ length: 60 * 100 }, (_, i) => (i % 60).toString().padStart(2, '0'));

  const periods = ['AM', 'PM'];

  const updateSelectionFromScroll = (event, data, setState) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    const index = Math.round(yOffset / ITEM_HEIGHT);
    const selectedItem = data[index % data.length];
    setState(selectedItem);
    onTimeChange(`${selectedHour}:${selectedMinute} ${selectedPeriod}`);
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
          //   backgroundColor: 'rgba(0,0,0,0.2)',
          borderWidth: 3,
          borderColor: '#1c3440',
          borderRadius: 7,
        }}
      ></View>
      <FlatList
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
      <FlatList
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
      />
      <FlatList
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
