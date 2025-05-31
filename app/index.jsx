import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const slideAnim = useRef(new Animated.Value(40)).current;

  useEffect(() => {
    const preloadAndRedirect = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const userData = await AsyncStorage.getItem('userData');
        const role = userData ? JSON.parse(userData).role?.toLowerCase() : null;

        if (token && role === 'admin') {
          router.replace('/(admin)/admin-home');
        } else if (token && role === 'customer') {
          router.replace('/(user)/user-home');
        } else {
          setIsReady(true);
        }
      } catch {
        setIsReady(true);
      }
    };

    preloadAndRedirect();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  if (!isReady) {
    // Show loading before UI and image load
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#556B2F" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={require('../assets/images/landing-page-bg.png')}
        style={styles.background}
        resizeMode="cover"
        onLoad={() => setImageLoaded(true)}
      >
        {!imageLoaded && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#556B2F" />
          </View>
        )}

        <View style={styles.overlay}>
          <Animated.View
            style={[styles.card, { transform: [{ translateY: slideAnim }] }]}
          >
            <Text style={styles.logo}>Forkcast.</Text>
            <Text style={styles.title}>Scan. Order. Enjoy.</Text>
            <View style={styles.underline} />
            <Text style={styles.subtitle}>
              Scan the QR code on your table to view the menu and place orders
              effortlessly.
            </Text>

            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.85}
              onPress={() => router.push('/(user)/user-home')}
            >
              <Text style={styles.buttonText}>Continue as User</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              activeOpacity={0.85}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.buttonTextSecondary}>Continue as Admin</Text>
            </TouchableOpacity>
          </Animated.View>
          <Text style={styles.footer}>© 2025 Forkcast. All rights reserved.</Text>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F0F4F8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.7)',
    zIndex: 10,
  },
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.6)', // semi-transparent white for subtle background
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    padding: 32,
    shadowColor: '#556B2F',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
    alignItems: 'center',
  },
  logo: {
    fontSize: 36,
    fontWeight: '900',
    color: '#556B2F',
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#0D1F3C',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 1.1,
  },
  underline: {
    width: 70,
    height: 4,
    backgroundColor: '#556B2F',
    borderRadius: 2,
    marginBottom: 18,
    alignSelf: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#606F85',
    textAlign: 'center',
    marginBottom: 28,
    lineHeight: 22,
  },
  primaryButton: {
    backgroundColor: '#556B2F',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#405222',
    shadowOpacity: 0.5,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 18,
  },
  secondaryButton: {
    borderColor: '#556B2F',
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 40,
    width: '100%',
    alignItems: 'center',
  },
  buttonTextSecondary: {
    color: '#556B2F',
    fontWeight: '700',
    fontSize: 18,
  },
  footer: {
    marginTop: 20,
    color: '#9AA3B1',
    fontSize: 12,
  },
});
