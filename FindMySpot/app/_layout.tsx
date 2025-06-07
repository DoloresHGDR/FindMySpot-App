import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
export default function RootLayout() {
  return (
      <UserProvider>
        <Stack
          initialRouteName="splash"
          screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
            <Stack.Screen name="screens/home" />
            <Stack.Screen name="screens/parking" />
        </Stack>
      </UserProvider>
  );

} 