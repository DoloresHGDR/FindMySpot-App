import { Stack } from "expo-router";
import { View } from "react-native";
import HomeFooter from "@/components/homeFooter";


export default function RootLayout() {
  return (
    <View style={{ flex: 1 }}> 
      <Stack
        screenOptions={{
          headerShown: false,
        }}>
      </Stack>
      <HomeFooter/>
    </View>

  );

}