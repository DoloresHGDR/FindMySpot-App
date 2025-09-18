import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
import { View} from "react-native";
import HomeFooter from "@/components/homeFooter";

export default function RootLayout() {
  return (
      <UserProvider >
        <Stack 
          screenOptions={{
            headerShown: false,
          }}>
            <Stack.Screen name="home" />
            <Stack.Screen name="parking" />
            <Stack.Screen name="plates" />
            <Stack.Screen name="history" />
            <Stack.Screen name="parkingDetailsScreen" />
            <Stack.Screen name="fines" />
        </Stack>
        <View>
          <HomeFooter/>
        </View>
      </UserProvider>
  );

} 