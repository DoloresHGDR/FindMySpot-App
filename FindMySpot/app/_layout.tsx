import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
export default function RootLayout() {
  return (
      <UserProvider>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
          }}>
          <Stack.Screen name="index" />
        </Stack>
      </UserProvider>
  );
  
}
