import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import BASE_URL from '../constants/constants';

export const registerPushToken = async (userId) => {
  try {
    if (!Device.isDevice) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      alert('Permission denied for push notifications');
      return;
    }

    const { data: pushToken } = await Notifications.getExpoPushTokenAsync();

    const userToken = await AsyncStorage.getItem('userToken');
    if (!userToken) return;

    await fetch(`${BASE_URL}/api/users/${userId}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${userToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        push_token: pushToken,
      }),
    });

    console.log('✅ Push token sent to Strapi:', pushToken);
  } catch (error) {
    console.error('Failed to register push token:', error);
  }
};
