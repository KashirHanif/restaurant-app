import { Stack } from 'expo-router';

export default function Layout() {
  return (
    <Stack>
      <Stack.Screen name='index' options={{headerShown:false}} />
      <Stack.Screen name='user-home' options={{headerShown:false}} />
      <Stack.Screen name='admin-home' options={{headerShown:false}} />
  </Stack>
  )
}
