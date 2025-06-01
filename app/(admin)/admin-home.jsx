import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { Button, Image, StyleSheet, Text, View } from 'react-native';
import TabHeader from '../../Components/TabHeader';

export default function AdminHome() {
  const router = useRouter();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    await AsyncStorage.removeItem('userData');
    await AsyncStorage.removeItem('restaurantData');
    router.replace('/');
  };

  return (
    <View style={styles.container}>
      {/* ✅ TabHeader with rightComponent */}
      <TabHeader
        title="Admin Home"
        rightComponent={
          <Button title="Logout" onPress={handleLogout} color="#6a994e" />
        }
      />

      <View style={styles.content}>
        <Image
          source={require('../../assets/images/Forkcast-logo.png')}
          style={styles.logo}
        />
        <Text style={styles.text}>Home page: analytics not currently available.</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ' #fffaf3',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  logo: {
    width: 200,
    height: 200,
    opacity: 0.1,
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
});
