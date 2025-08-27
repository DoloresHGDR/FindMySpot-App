import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";

export default function RootLayout() {
  return (
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="index" />
            <Stack.Screen name="login" />
            <Stack.Screen name="register" />
            <Stack.Screen name="screens/home" />
            <Stack.Screen name="screens/parking" />
            <Stack.Screen name="screens/plates" />
            <Stack.Screen name="screens/history" />
            <Stack.Screen name="screens/parkingDetailsScreen" />
        </Stack>
      </UserProvider>
  );

} 