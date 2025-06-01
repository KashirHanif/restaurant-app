import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

export default function AdminProfile() {
  const [restaurantName, setRestaurantName] = useState('');
  const [location, setLocation] = useState('');
  const [tables, setTables] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [restaurantId, setRestaurantId] = useState(null);

  useEffect(() => {
    const fetchStoredData = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        const restaurantData = await AsyncStorage.getItem('restaurantData');

        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUsername(parsedUser.username || '');
          setUserId(parsedUser.id);
        }

        if (restaurantData) {
          const parsedRestaurant = JSON.parse(restaurantData);
          setRestaurantId(parsedRestaurant?.documentId);
          setRestaurantName(parsedRestaurant.name || '');
          setLocation(parsedRestaurant.location || '');
          setTables(parsedRestaurant.number_of_tables?.toString() || '');
        }
      } catch (e) {
        console.error('Failed to load stored data:', e);
      }
    };

    fetchStoredData();
  }, []);

  const handleSave = async () => {
    if (!restaurantName.trim() || !location.trim() || !tables.trim()) {
      setError('Please fill all fields');
      return;
    }
    if (isNaN(tables) || Number(tables) <= 0) {
      setError('Number of tables must be a positive number');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        setLoading(false);
        return;
      }

      const payload = {
        data: {
          name: restaurantName,
          location,
          number_of_tables: Number(tables),
          owner: userId,
        },
      };

      const url = restaurantId
        ? `http://192.168.100.92:1337/api/restaurants/${restaurantId}`
        : 'http://192.168.100.92:1337/api/restaurants';

      const method = restaurantId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (response.ok) {
        await AsyncStorage.setItem('restaurantData', JSON.stringify(result.data));
        Alert.alert('Success', restaurantId ? 'Profile updated!' : 'Profile saved successfully!');
        setRestaurantId(result.data.documentId);
      } else {
        Alert.alert('Error', result.error?.message || 'Failed to save restaurant');
      }
    } catch (e) {
      console.error('Save error:', e);
      Alert.alert('Error', 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isSaveDisabled =
    !restaurantName.trim() ||
    !location.trim() ||
    !tables.trim() ||
    isNaN(tables) ||
    Number(tables) <= 0;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ImageBackground
        source={require('../../assets/images/admin-profile-bg.png')}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay}>
          <ScrollView
            contentContainerStyle={styles.scrollContainer}
            keyboardShouldPersistTaps="handled"
          >
            <Image
              source={require('../../assets/images/user-icon.png')}
              style={styles.profileIcon}
            />

            <Text style={styles.welcomeText}>Welcome, {username || 'Admin'}!</Text>
            <Text style={styles.heading}>Setup Restaurant Profile</Text>

            <View style={styles.formCard}>
              <TextInput
                placeholder="Restaurant Name"
                style={styles.input}
                value={restaurantName}
                onChangeText={setRestaurantName}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Location"
                style={styles.input}
                value={location}
                onChangeText={setLocation}
                placeholderTextColor="#888"
              />
              <TextInput
                placeholder="Number of Tables"
                style={styles.input}
                value={tables}
                onChangeText={setTables}
                keyboardType="numeric"
                placeholderTextColor="#888"
              />

              {!!error && <Text style={styles.error}>{error}</Text>}

              <TouchableOpacity
                style={[styles.button, isSaveDisabled && { backgroundColor: '#ccc' }]}
                onPress={handleSave}
                disabled={isSaveDisabled || loading}
              >
                <Text style={styles.buttonText}>
                  {restaurantId ? 'Edit Profile' : 'Save Profile'}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    marginTop:70
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingBottom: 40,
    paddingTop: 60, // Adjusted for better vertical spacing since TabHeader is removed
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
  formCard: {
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
  input: {
    backgroundColor: '#f4f1ea',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    fontSize: 16,
    color: '#3e403f',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#d9d4c5',
  },
  error: {
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: '600',
  },
  button: {
    backgroundColor: '#6a994e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: '#fffaf3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
