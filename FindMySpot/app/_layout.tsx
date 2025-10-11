import { Stack } from "expo-router";
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QUERY_KEYS } from "@/constants/queryKeys";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5*60*1000,
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  storage: AsyncStorage,
  key: `RQuery_${QUERY_KEYS.USER}`, 
});

export default function RootLayout() {
  return (
    <PersistQueryClientProvider 
      client={queryClient}
      persistOptions={{ persister: asyncStoragePersister, maxAge: Infinity}}
      onSuccess={() => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.USER] });
      }}
      >
        <Stack
          screenOptions={{
            headerShown: false,
          }}>
        </Stack>
    </PersistQueryClientProvider>
  );

} 