import { Stack } from 'expo-router';

export default function UserLayout() {
  return (
    <Stack>
      <Stack.Screen name="user-home" options={{ headerShown: false }} />
      <Stack.Screen name="user-menu" options={{ headerShown: false  }} />
      <Stack.Screen name="user-profile" options={{ headerShown: false}}/>
    </Stack>
  );
}
