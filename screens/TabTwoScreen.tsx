import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, TextInput, Pressable, Button } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';

export default function TabTwoScreen() {
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);

  async function getMarkers() {
    const markersFromStore = await SecureStore.getItemAsync('markers') || [];
    setMarkers(JSON.parse(markersFromStore));
  }

  useEffect(() => {
    getMarkers();
  }, [markers]);

  const openModal = (id: number) => {
    setModalVisible(!modalVisible);
    const marker = markers.find((element) => element.id === id);

    setCurrentMarker(marker);
  }

  async function onDeletePress(id) {
    const updatedMarkers = markers.filter((element) => element.id !== id);
    setMarkers(updatedMarkers);
    await SecureStore.setItemAsync('markers', JSON.stringify(updatedMarkers));
  }

  const modal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Title: {currentMarker?.title}</Text>
          <Text style={styles.modalText}>Description: {currentMarker?.description}</Text>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: currentMarker?.coordinate?.latitude,
              longitude: currentMarker?.coordinate?.longitude,
              latitudeDelta: 0.0032,
              longitudeDelta: 0.0031,
            }}
            showsMyLocationButton={false}
            >
              <Marker
                coordinate={{
                  latitude: currentMarker?.coordinate?.latitude,
                  longitude: currentMarker?.coordinate?.longitude,
                }}
                pinColor="red"
              />
          </MapView >
          {/* <Pressable
            style={styles.buttonOk}
            onPress={handleClick}
          >
            <Text style={styles.textStyle}>OK</Text>
          </Pressable> */}
          <Pressable
            style={styles.buttonCancel}
            onPress={() => setModalVisible(false)}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      {modalVisible && modal}
      { markers.length > 0 && markers.map((element) => (
        <View style={styles.card} key={element.id}>
          <TouchableOpacity onPress={() => openModal(element.id)}>
            <View>
              <Text style={styles.title}>
                {element.title}
              </Text>
              <Text>
                {element.description}
              </Text>
            </View>
          </TouchableOpacity>
          <Button title="Delete" onPress={() => onDeletePress(element.id)} />
          <Button title="Edit" />
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
  button: {
    borderRadius: 6,
    borderWidth: 1,
    backgroundColor: 'red',
  },
  title: {
    maxHeight: 50,
    fontSize: 16,
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  buttonCancel: {
    borderRadius: 20,
    width: 300,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
    opacity: 0.5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    fontSize: 17,
    width: 160,
    textAlign: "center"
  },
  map: {
    width: 300,
    height: 300,
  },
});
