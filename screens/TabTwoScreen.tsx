import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';

export default function TabTwoScreen() {
  const [markers, setMarkers] = useState([]);
  
  async function getMarkers() {
    const markersFromStore = await SecureStore.getItemAsync('markers') || [];
    setMarkers(JSON.parse(markersFromStore));
  }

  useEffect(() => {
    getMarkers();
  }, []);

  return (
    <View style={styles.container}>
      { markers.length > 0 && markers.map((element) => (
        <>
          <Text style={styles.title} key={element.id}>
            {element.title}
          </Text>
          <Text key={element.id}>
            {element.description}
          </Text>
          <View style={styles.underline}/>
        </>
      )) }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  underline: {
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    width: 1000,
    marginTop: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
