import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';
import ForkcastLogo from '../../assets/images/Forkcast-logo.png';
import { useSignup } from '../../hooks/useSignup';
import { useLocalSearchParams } from 'expo-router';

export default function Signup() {
  const router = useRouter();
  const { role = 'Customer' } = useLocalSearchParams();

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [focusedField, setFocusedField] = useState(null);

  const { signup, error, setError } = useSignup();

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
        style={[styles.input, focusedField === 'email' && styles.inputFocused]}
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(val) => {
          setEmail(val);
          setError('');
        }}
        onFocus={() => setFocusedField('email')}
        onBlur={() => setFocusedField(null)}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Username"
        style={[styles.input, focusedField === 'username' && styles.inputFocused]}
        autoCapitalize="none"
        value={username}
        onChangeText={(val) => {
          setUsername(val);
          setError('');
        }}
        onFocus={() => setFocusedField('username')}
        onBlur={() => setFocusedField(null)}
        placeholderTextColor="#888"
      />

      <TextInput
        placeholder="Password"
        style={[styles.input, focusedField === 'password' && styles.inputFocused]}
        secureTextEntry
        value={password}
        onChangeText={(val) => {
          setPassword(val);
          setError('');
        }}
        onFocus={() => setFocusedField('password')}
        onBlur={() => setFocusedField(null)}
        placeholderTextColor="#888"
      />

      {!!error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={styles.button}
        onPress={() => signup({ username, email, password, role: role })}
      >
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
    width: 480,
    height: 280,
    marginLeft: 15,
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