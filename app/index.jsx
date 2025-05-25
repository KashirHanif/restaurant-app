import { Asset } from 'expo-asset';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Animated, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import ForkcastLogo from '../assets/images/Forkcast-logo-white.png';

export default function LandingScreen() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Animated value for drop down
  const slideAnim = useRef(new Animated.Value(-200)).current; // start 200 above

  // Preload image before rendering
  useEffect(() => {
    async function load() {
      await Asset.loadAsync(require('../assets/images/landingpage-bg.png'));
      setIsReady(true);
    }
    load();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 1000,  // 1 second animation
      useNativeDriver: true,
    }).start();
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff6f00" />
      </View>
    );
  }

  return (
    <ImageBackground
      source={require('../assets/images/landingpage-bg.png')}
      style={styles.background}
      resizeMode="cover"
      blurRadius={3}
    >
      <View style={styles.overlay}>
        {/* Animated logo */}
        <Animated.Image
          source={ForkcastLogo}
          style={[styles.logo, { transform: [{ translateY: slideAnim }] }]}
          resizeMode="contain"
        />

        <Text style={styles.title}>Scan. Order. Enjoy.</Text>
        <Text style={styles.subtitle}>
          Discover the easiest way to dine! Just scan the QR code on your table,
          view the live menu, and place your order right from your phone.
        </Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/user-home')}
        >
          <Text style={styles.buttonText}>Continue as User</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.adminButton]}
          onPress={() => router.push('/(admin)/admin-home')}
        >
          <Text style={styles.buttonText}>Continue as Admin</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // or any background you prefer while loading
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 30,
    margin: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  logo: {
    width: 440,
    height: 280,
    alignSelf: 'center',
    marginLeft: 20,
  },
  title: {
    fontSize: 32,
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#ddd',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#ff6f00',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginVertical: 10,
    width: '80%',
    alignItems: 'center',
  },
  adminButton: {
    backgroundColor: '#00897b',
  },
  
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
