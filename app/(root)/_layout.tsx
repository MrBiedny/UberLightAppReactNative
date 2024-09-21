import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="Find-ride" options={{ headerShown: false }} />
      <Stack.Screen name="Confirm-ride" options={{ headerShown: false }} />
      <Stack.Screen name="Book-ride" options={{ headerShown: false }} />
    </Stack>
  );
}
