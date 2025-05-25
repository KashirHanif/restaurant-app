import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack, useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function Layout() {
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        const role = userData ? JSON.parse(userData).role?.name?.toLowerCase() : null;

        if (token && role === 'admin') {
          router.push('/(admin)/admin-home');
        } else if (token && role === 'customer') { 
          router.push('/(user)/user-home');
        }
        // If no token, do nothing — stay on landing page (index)
      } catch (err) {
        console.error('Token check failed:', err);
      }  
    };

    checkToken();
  }, []);

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(user)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
    </Stack>
  );
}
