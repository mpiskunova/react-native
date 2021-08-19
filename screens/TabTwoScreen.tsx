import React, { useEffect, useState } from 'react';
import { StyleSheet, TouchableOpacity, Modal, TextInput, Pressable } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Text, View } from '../components/Themed';
import * as SecureStore from 'expo-secure-store';
import { Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

export default function TabTwoScreen() {
  const [markers, setMarkers] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [currentMarker, setCurrentMarker] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [error, getError] = useState(null);

  async function getMarkers() {
    const markersFromStore = await SecureStore.getItemAsync('markers') || [];
    setMarkers(JSON.parse(markersFromStore));
  }
  
  useEffect(() => {
    getMarkers();
  }, []);

  useEffect(() => {
    getMarkers();
  }, [markers]);

  const openModal = (id: number) => {
    setModalVisible(!modalVisible);
    const marker = markers.find((element) => element.id === id);

    setCurrentMarker(marker);
  }

  const openEditModal = (id: number) => {
    setEditModalVisible(!editModalVisible);
    const marker = markers.find((element) => element.id === id);

    setCurrentMarker(marker);
    setTitle(marker.title);
    setDescription(marker.description)
  }

  async function onDeletePress(id) {
    const updatedMarkers = markers.filter((element) => element.id !== id);
    setMarkers(updatedMarkers);
    setModalVisible(false);
    await SecureStore.setItemAsync('markers', JSON.stringify(updatedMarkers));
  }

  async function editMarker() {
    if (description.trim() === '' || title.trim() === '') {
      getError('Empty values not allowed')
    } else {
      const newMarker = {
        ...currentMarker,
        title,
        description,
      }
      const updatedMarkers = markers.map((element) => {
        if (element.id === currentMarker.id) {
          return newMarker
        } else {
          return element
        }
      });

      setMarkers(updatedMarkers);
      setCurrentMarker(newMarker);
      await SecureStore.setItemAsync('markers', JSON.stringify(updatedMarkers));
      setEditModalVisible(!editModalVisible);
    }
  }

  async function deleteAllMarkers() {
    await SecureStore.deleteItemAsync('markers');
    setMarkers([]);
    setDeleteModalVisible(false);
  }

  const modal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Pressable
            style={styles.buttonBack}
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="arrow-back-outline" size={24} color="black" />
          </Pressable>
          <Pressable
            style={styles.buttonEdit}
            onPress={() => openEditModal(currentMarker?.id)}
          >
            <MaterialIcons name="mode-edit" size={24} color="black" />
          </Pressable>
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
          <Pressable style={styles.buttonDelete} onPress={() => onDeletePress(currentMarker?.id)}>
            <Text style={styles.textStyle}>
              Delete
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )

  const deleteModal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={deleteModalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Delete all markers?</Text>
          <Pressable
            style={styles.buttonDeleteAll}
            onPress={deleteAllMarkers}
          >
            <Text style={styles.textStyle}>Delete</Text>
          </Pressable>
          <Pressable
            style={styles.buttonCancel}
            onPress={() => setDeleteModalVisible(false)}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )

  const editModal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={editModalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Edit marker</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Edit title"
          />
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            placeholder="Edit description"
          />
          {error != null &&
            <Text>{error}</Text>
          }
          <Pressable
            style={styles.buttonOk}
            onPress={editMarker}
          >
            <Text style={styles.textStyle}>OK</Text>
          </Pressable>
          <Pressable
            style={styles.buttonCancel}
            onPress={() => setEditModalVisible(false)}
          >
            <Text style={styles.textStyle}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  )

  return (
    <View style={styles.container}>
      <Pressable style={styles.dots} onPress={() => setDeleteModalVisible(!deleteModalVisible)}>
        <Entypo  name="dots-three-vertical" size={24} color="black" />
      </Pressable>
      {modalVisible && modal}
      {editModalVisible && editModal}
      {deleteModalVisible && deleteModal}
      { markers.length > 0
        ? markers.map((element) => (
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
          </View>
        )) 
        : <Text>There is no marker</Text>}
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
  dots: {
    position: "absolute",
    // zIndex: 1000000000,
    left: "auto",
    right: 15,
    // top: -15,
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
    width: '90%',
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
  input: {
    height: 40,
    width: 200,
    borderRadius: 20,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
  buttonCancel: {
    borderRadius: 20,
    width: 200,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
    opacity: 0.5,
  },
  buttonBack: {
    position: "absolute",
    left: 15,
    marginTop: 20,
  },
  buttonEdit: {
    position: "absolute",
    left: "auto",
    right: 15,
    marginTop: 20,
  },
  buttonDelete: {
    borderRadius: 20,
    width: 300,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "red",
  },
  buttonDeleteAll: {
    borderRadius: 20,
    width: 200,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "red",
  },
  buttonOk: {
    borderRadius: 20,
    width: 200,
    padding: 10,
    marginTop: 20,
    elevation: 2,
    backgroundColor: "#2196F3",
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
