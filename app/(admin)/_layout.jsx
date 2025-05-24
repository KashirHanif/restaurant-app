import { Stack } from 'expo-router';

export default function AdminLayout() {
  return (
    <Stack>
      <Stack.Screen name="admin-home" options={{ headerShown: false }} />
      {/* Add more admin screens here if needed */}
    </Stack>
  );
}
