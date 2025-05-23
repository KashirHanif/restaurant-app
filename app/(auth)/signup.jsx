import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import ForkcastLogo from '../../assets/images/Forkcast-logo.png';

export default function Signup() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const validateEmail = (email) =>
    /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email);

  const handleSignup = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!validateEmail(email)) {
        setError('Please enter a valid email.');
        return;
    }
    if (username.length < 3) {
        setError('Username must be at least 3 characters.');
        return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
    }

    try {
        const response = await fetch('http://192.168.100.98:1337/api/auth/custom-register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
            password,
            roleType: 'Admin', // or 'customer'
        }),
        });

        const data = await response.json();

        if (response.ok) {
        Alert.alert('Success', 'Admin account created!');
        router.replace('/login');
        } else {
        console.log('Signup Error:', data);
        setError(data?.error?.message || 'Signup failed. Please try again.');
        }
    } catch (error) {
        console.error('Network Error:', error);
        setError('Something went wrong. Please check your connection.');
    }
};




  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.logoWrapper}>
        <Image source={ForkcastLogo} style={styles.logo} resizeMode="contain" />
      </View>

      <Text style={styles.title}>Create Account</Text>

      <TextInput
        placeholder="Email"
        style={[
          styles.input,
          focusedField === 'email' && styles.inputFocused,
        ]}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Username"
        style={[
          styles.input,
          focusedField === 'username' && styles.inputFocused,
        ]}
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
        onFocus={() => setFocusedField('username')}
        onBlur={() => setFocusedField(null)}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        style={[
          styles.input,
          focusedField === 'password' && styles.inputFocused,
        ]}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
        placeholderTextColor="#888"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/login')}>
        <Text style={styles.switchText}>
          Already have an account? <Text style={styles.switchLink}>Login here</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  logo: {
    width: 220,
    height: 120,
    marginLeft: -10,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    color: '#3e403f',
    marginBottom: 36,
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f4eadd',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: '#3e403f',
    marginBottom: 16,
  },
  inputFocused: {
    backgroundColor: '#ede4d4',
    borderWidth: 1,
    borderColor: '#6a994e',
  },
  button: {
    backgroundColor: '#6a994e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
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
  error: {
    color: '#d9534f',
    marginBottom: 12,
    textAlign: 'center',
  },
  switchText: {
    color: '#6c5c45',
    fontSize: 14,
    textAlign: 'center',
  },
  switchLink: {
    color: '#6a994e',
    fontWeight: '700',
  },
});
