import { Stack } from "expo-router";
import { UserProvider } from "@/context/UserContext";
import { View } from "react-native";
import HomeFooter from "@/components/homeFooter";

export default function RootLayout() {
  return (
      <UserProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
        </Stack>
        <View>
            <HomeFooter/>
        </View>
      </UserProvider>
  );

}