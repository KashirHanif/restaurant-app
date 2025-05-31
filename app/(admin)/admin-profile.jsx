import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

export default function AdminProfile() {
  const [restaurantName, setRestaurantName] = useState('');
  const [location, setLocation] = useState('');
  const [tables, setTables] = useState('');
  const [error, setError] = useState('');
  const [username, setUsername] = useState('');
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);

  const [restaurantId, setRestaurantId] = useState(null); // 🆕 store ID for PUT

useEffect(() => {
  const fetchStoredData = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      console.log(userData);
      const restaurantData = await AsyncStorage.getItem('restaurantData');
      console.log(restaurantData);

      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUsername(parsedUser.username || '');
        setUserId(parsedUser.id);
      }

      if (restaurantData) {
        const parsedRestaurant = JSON.parse(restaurantData);
        setRestaurantId(parsedRestaurant?.documentId); // 🆕 Set restaurant ID
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
      owner: userId, // Correctly structured as an object with the related user's ID

    },
  };


    console.log(payload)
    const url = restaurantId
      ? `http://192.168.100.98:1337/api/restaurants/${restaurantId}` // PUT for existing
      : 'http://192.168.100.98:1337/api/restaurants'; // POST for new

    const method = restaurantId ? 'PUT' : 'POST';
    console.log("Request sent type : ",method)
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("Result is " ,result);

    if (response.ok) {
      await AsyncStorage.setItem('restaurantData', JSON.stringify(result.data));
 
      Alert.alert('Success', restaurantId ? 'Profile updated!' : 'Profile saved successfully!');
      setRestaurantId(result.data.documentId); // update after creation
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
      style={{ flex: 1, backgroundColor: '#fffaf3' }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.welcomeText}>Welcome, {username || 'Admin'}!</Text>
        <Text style={styles.heading}>Setup Restaurant Profile</Text>

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

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 28,
    paddingTop: 50,
    flexGrow: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#3e403f',
    marginBottom: 15,
    textAlign: 'center',
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 30,
    color: '#3e403f',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4eadd',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#3e403f',
    marginBottom: 20,
  },
  error: {
    color: '#d9534f',
    textAlign: 'center',
    marginBottom: 20,
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
