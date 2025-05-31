import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Button, StyleSheet, Text, View } from 'react-native';
import TabHeader from '../../../Components/TabHeader';
import { useCartStore } from '../../../stores/useCartStore';

export default function UserProfile() {
  const router = useRouter();

  const { clearCart } = useCartStore();
  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    clearCart();
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      <TabHeader
        title="Profile"
        rightComponent={<Button title="Logout" onPress={handleLogout} color="#6a994e" />}
      />

      <View style={styles.content}>
        <Text style={styles.text}>This is the User Profile screen</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20, // enough spacing below header
  },
  text: {
    fontSize: 18,
    color: '#3e403f',
  },
});
