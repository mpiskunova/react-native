import React, { useEffect, useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, Dimensions, Modal, Pressable, Text, TextInput } from 'react-native';
import { View } from '../components/Themed';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import * as SecureStore from 'expo-secure-store';

export default function TabOneScreen() {
  Location.requestForegroundPermissionsAsync();

  const [markers, setMarkers] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [pinCoordinate, setPinCoordinate] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [error, getError] = useState(null);

  async function getMarkers() {
    const markersFromStore = await SecureStore.getItemAsync('markers') || [];
    setMarkers(JSON.parse(markersFromStore));
  }
  
  async function saveMarkers(updated: any) {
    await SecureStore.setItemAsync('markers', JSON.stringify(updated));
    setTitle('');
    setDescription('');
  }
  
  useEffect(() => {
    (async () => {
      await Location.getCurrentPositionAsync({});
    })();
    getMarkers();
  }, []);
  
  const handleMapPress = async (coordinate: any) => {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setPinCoordinate(coordinate);
    
    setModalVisible(!modalVisible);
  };

  const handleClick = () => {
    if (description.trim() === '' || title.trim() === '') {
      getError('Empty values not allowed')
    } else {
      const updatedMarkers = [...markers, {
      coordinate: pinCoordinate,
      title: title.trim(),
      description: description.trim(),
      id: Date.now(),
    }];
    
    setMarkers(updatedMarkers);
    setModalVisible(!modalVisible);

    return saveMarkers(updatedMarkers);
    }
  }

  const modal = (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Add title and description</Text>
          <TextInput
            style={styles.input}
            onChangeText={setTitle}
            value={title}
            placeholder="Add title"
          />
          <TextInput
            style={styles.input}
            onChangeText={setDescription}
            value={description}
            placeholder="Add description"
          />
          {error != null &&
            <Text>{error}</Text>
          }
          <Pressable
            style={styles.buttonOk}
            onPress={handleClick}
          >
            <Text style={styles.textStyle}>OK</Text>
          </Pressable>
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
      {modal}
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 47.21855589547013,
          longitude: 38.918362567185625,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        showsMyLocationButton={false}
        showsUserLocation
        onPress={(event) => handleMapPress(event.nativeEvent.coordinate)}
        // provider="google"
        >
          { markers.length > 0 && markers.map((element) => (
            <Marker
              coordinate={{
                latitude: element.coordinate.latitude,
                longitude: element.coordinate.longitude,
              }}
              pinColor="red"
              key={element.id}
            />
          )) }
      </MapView >
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
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
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
  buttonOk: {
    borderRadius: 20,
    width: 160,
    padding: 10,
    marginTop: 10,
    elevation: 2,
    backgroundColor: "#2196F3",
  },
  buttonCancel: {
    borderRadius: 20,
    width: 160,
    padding: 10,
    marginTop: 10,
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
  input: {
    height: 40,
    width: 160,
    borderRadius: 20,
    margin: 10,
    borderWidth: 1,
    padding: 10,
  },
});
