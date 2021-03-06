import React, { Fragment, useState, useEffect } from "react";
import { View, SafeAreaView, Text, Button } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { HStack } from "native-base";
import {
  Entypo,
  MaterialIcons,
  Ionicons,
  MaterialCommunityIcons,
  AntDesign,
  FontAwesome5,
} from "@expo/vector-icons";
import { HOST } from "@env";

function MapScreen(props) {
  const [tableauLocalisations, setTableauLocalisations] = useState([]);

  console.log("tableauLocalisations", tableauLocalisations);

  useEffect(() => {
    const getCommercantsLocalisations = async () => {
      const rawResponseBackend = await fetch(`${HOST}/mapping`);
      const localisationCommercants = await rawResponseBackend.json();
      console.log("LOCALISATION COMMERCANTS", localisationCommercants);
      setTableauLocalisations(localisationCommercants.tableauLocCommercants);
    };
    getCommercantsLocalisations();
  }, []);

  const handleMap = () => {
    props.navigation.navigate("map");
  };
  const handleFeed = () => {
    props.navigation.navigate("feed");
  };
  return (
    <View style={{ flex: 1 }}>
      <HStack
        justifyContent="space-between"
        name="filternotif"
        style={{ flex: 0, padding: 10, marginTop: 40 }}
      >
        <MaterialIcons name="tune" size={24} color="#B6B6B6" />
        <Ionicons name="notifications" size={24} color="#B6B6B6" />
      </HStack>
      <HStack
        name="filtermap"
        style={{
          backgroundColor: "#FBFAFA",
          width: "25%",
          alignSelf: "center",
          alignItems: "center",
          justifyContent: "center",
          borderBottomRightRadius: 20,
          borderBottomLeftRadius: 20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}
      >
        <MaterialCommunityIcons
          type="button"
          name="form-select"
          size={40}
          color="#B6B6B6"
          title="feed"
          onPress={() => handleFeed()}
        />
        <MaterialCommunityIcons
          name="map-search-outline"
          size={40}
          color="#37b4aa"
          title="map"
          onPress={() => handleMap()}
        />
      </HStack>
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 43.7320395,
          longitude: 7.421953,
          latitudeDelta: 0.0014,
          longitudeDelta: 0.009,
        }}
      >
        <Marker
          pinColor="red"
          title="La Capsule"
          description="On code !"
          coordinate={{
            latitude: 43.7278585,
            longitude: 7.4115085,
          }}
        />
        {tableauLocalisations.map((commercant, index) => {
          return (
            <Marker
              coordinate={{
                latitude: commercant.latitude,
                longitude: commercant.longitude,
              }}
              key={index}
              opacity={0.5}
              title={commercant.nomEnseigne}
              description={commercant.description}
              pinColor="#0037ff"
            />
          );
        })}
      </MapView>
    </View>
  );
}

export default MapScreen;
