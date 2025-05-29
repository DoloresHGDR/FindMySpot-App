import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
export default function RootLayout() {
  return (
      <UserProvider>
        <Stack
          initialRouteName="splash"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
            <Stack.Screen name="splash" />
            <Stack.Screen name="index" />
            <Stack.Screen name="register" />
        </Stack>
      </UserProvider>
  );

} 