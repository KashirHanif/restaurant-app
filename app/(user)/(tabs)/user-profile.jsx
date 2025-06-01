import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import TabHeader from '../../../Components/TabHeader';
import { useCartStore } from '../../../stores/useCartStore';

export default function UserProfile() {
  const router = useRouter();
  const { clearCart } = useCartStore();

  const [username, setUsername] = useState('');
  const [restaurantName, setRestaurantName] = useState('');

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const restaurantData = await AsyncStorage.getItem('restaurantData');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUsername(parsedUser.username || '');
        }

        if (restaurantData) {
          const parsedRestaurant = JSON.parse(restaurantData);
          setRestaurantName(parsedRestaurant.name || '');
        }
      } catch (e) {
        console.error('Failed to load stored data:', e);
      }
    };

    fetchStoredData();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      clearCart();
      router.replace('/');
    } catch (e) {
      Alert.alert('Error', 'Failed to log out');
      console.error('Logout error:', e);
    }
  };

  return (
    <View style={styles.container}>
      <TabHeader
        title="Profile"
        rightComponent={<Button title="Logout" onPress={handleLogout} color="#6a994e" />}
      />
      <ImageBackground
        source={require('../../../assets/images/admin-profile-bg.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <Image
              source={require('../../../assets/images/user-icon.png')}
              style={styles.profileIcon}
            />
            <Text style={styles.welcomeText}>Welcome, {username || 'User'}!</Text>
            <Text style={styles.heading}>Your Profile</Text>

            <View style={styles.infoCard}>
              <Text style={styles.label}>Name:</Text>
              <Text style={styles.value}>{username || 'N/A'}</Text>

              <Text style={[styles.label, { marginTop: 12 }]}>Restaurant:</Text>
              <Text style={styles.value}>{restaurantName || 'N/A'}</Text>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
  },
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    marginTop: 70,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 60,
    flexGrow: 1,
  },
  profileIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    alignSelf: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#666',
    textAlign: 'center',
    marginBottom: 4,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    color: '#3e403f',
    textAlign: 'center',
    marginBottom: 16,
  },
  infoCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.65)',
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e403f',
  },
  value: {
    fontSize: 16,
    color: '#3e403f',
    marginTop: 4,
  },
});
