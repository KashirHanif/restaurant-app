import { StyleSheet, Text, View, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function UserProfile() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Logout" onPress={handleLogout} color="#6a994e" />
      </View>
      <Text style={styles.text}>This is the User Profile screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  header: {
    position: 'absolute',
    top: 40,
    right: 20,
  },
  text: {
    fontSize: 18
  }
});
