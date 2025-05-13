import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
<<<<<<< HEAD
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
    </Stack>
=======
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
>>>>>>> 13196c7baaed500659263d35d5f38c8aa8ebf021
  );
}
