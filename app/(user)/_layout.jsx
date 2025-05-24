import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="user-home" options={{ headerShown: false }} />
      {/* Add more user screens here if needed */}
    </Stack>
  );
}
