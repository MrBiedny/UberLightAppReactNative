import { useEffect, useState } from "react";
import MapView, { Marker, PROVIDER_DEFAULT } from "react-native-maps";
import { ActivityIndicator, Text, View } from "react-native";
import MapViewDirections from "react-native-maps-directions";

import { useLocationStore, userDriverStore } from "@/store";
import {
  calculateDriverTimes,
  calculateRegion,
  generateMarkersFromData,
} from "@/lib/map";
import { Driver, MarkerData } from "@/types/type";
import { icons } from "@/constants";
import { useFetch } from "@/lib/fetch";

export default function Map() {
  const { data: drivers, loading, error } = useFetch<Driver[]>("/(api)/driver");

  const {
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  } = useLocationStore();
  const { selectedDriver, setDrivers } = userDriverStore();
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const region = calculateRegion({
    userLongitude,
    userLatitude,
    destinationLongitude,
    destinationLatitude,
  });

  useEffect(
    function () {
      if (Array.isArray(drivers)) {
        if (!userLatitude || !userLongitude) return;

        const newMarkers = generateMarkersFromData({
          data: drivers,
          userLatitude,
          userLongitude,
        });
        setMarkers(newMarkers);
      }
    },
    [userLatitude, userLongitude, drivers]
  );

  useEffect(
    function () {
      if (markers.length > 0 && destinationLatitude && destinationLongitude) {
        calculateDriverTimes({
          markers,
          userLongitude,
          userLatitude,
          destinationLatitude,
          destinationLongitude,
        }).then((drivers) => {
          setDrivers(drivers as MarkerData[]);
        });
      }
    },
    [
      markers,
      userLongitude,
      userLatitude,
      destinationLatitude,
      destinationLongitude,
      setDrivers,
    ]
  );

  if (loading || !userLatitude || !userLongitude) {
    return (
      <View className="flex justify-between items-center w-full">
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex justify-between items-center w-full">
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <MapView
      provider={PROVIDER_DEFAULT}
      className="w-full h-full rounded-2xl"
      tintColor="black"
      mapType="mutedStandard"
      showsPointsOfInterest={false}
      initialRegion={region}
      showsUserLocation={true}
      userInterfaceStyle="light"
    >
      {markers.map((marker) => (
        <Marker
          key={marker.id}
          coordinate={{
            latitude: marker.latitude,
            longitude: marker.longitude,
          }}
          title={marker.title}
          image={
            selectedDriver === marker.id ? icons.selectedMarker : icons.marker
          }
        />
      ))}

      {destinationLatitude && destinationLongitude && (
        <>
          <Marker
            key="destination"
            coordinate={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            title="Destination"
            image={icons.pin}
          />
          <MapViewDirections
            origin={{
              latitude: userLatitude!,
              longitude: userLongitude!,
            }}
            destination={{
              latitude: destinationLatitude,
              longitude: destinationLongitude,
            }}
            apikey={process.env.EXPO_PUBLIC_GOOGLE_API_KEY!}
            strokeColor="#0286ff"
            strokeWidth={3}
          />
        </>
      )}
    </MapView>
  );
}
