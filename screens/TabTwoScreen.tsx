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
  }, [markers]);

  return (
    <View style={styles.container}>
      { markers.length > 0 && markers.map((element) => (
        <View key={element.id} style={styles.card} onPress={() => console.log(123)}>
          <Text style={styles.title}>
            {element.title}
          </Text>
          <Text>
            {element.description}
          </Text>
        </View>
      )) }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  card: {
    borderRadius: 6,
    borderWidth: 1,
    width: '90%',
    marginBottom: 15,
    minHeight: 70,
    padding: 15,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },

});
