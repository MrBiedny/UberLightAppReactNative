import { FlatList, View } from "react-native";
import { router } from "expo-router";

import RideLayout from "@/components/RideLayout";
import DriverCard from "@/components/DriverCard";
import CustomButton from "@/components/CustomButton";
import { userDriverStore } from "@/store";

export default function ConfirmRide() {
  const { drivers, selectedDriver, setSelectedDriver } = userDriverStore();

  return (
    <RideLayout title="Choose a driver" snapPoints={["65%", "85%"]}>
      <FlatList
        data={drivers}
        keyExtractor={(_, idnex) => idnex.toString()}
        renderItem={({ item }) => (
          <DriverCard
            selected={selectedDriver!}
            setSelected={() => setSelectedDriver(Number(item.id)!)}
            item={item}
          />
        )}
        ListFooterComponent={() => (
          <View className="mx-5 mt-10">
            <CustomButton
              title="Select Ride"
              onPress={() => router.push("/(root)/Book-ride")}
            />
          </View>
        )}
      />
    </RideLayout>
  );
}
