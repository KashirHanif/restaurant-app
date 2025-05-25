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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const user = JSON.parse(userData);
          setUsername(user.username || '');
        }
      } catch (e) {
        console.error('Failed to load user data:', e);
      }
    };

    fetchUser();
  }, []);

  const handleSave = () => {
    if (!restaurantName.trim() || !location.trim() || !tables.trim()) {
      setError('Please fill all fields');
      return;
    }
    if (isNaN(tables) || Number(tables) <= 0) {
      setError('Number of tables must be a positive number');
      return;
    }
    setError('');
    Alert.alert('Success', 'Profile saved successfully!');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#fffaf3' }}
    >
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={styles.welcomeText}>Welcome, {username ? username : 'Admin'}!</Text>

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

        <TouchableOpacity style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save Profile</Text>
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
