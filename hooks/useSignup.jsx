import { useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

export const useSignup = () => {
  const router = useRouter();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email) =>
    /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(email);

  const signup = async ({ username, email, password, role }) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setError('');

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
      setLoading(true);
      const response = await fetch('http://192.168.100.98:1337/api/auth/custom-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role }),
      });

      const data = await response.json();

      if (response.ok) {
        Alert.alert('Success', `${role} account created!`);
        router.replace('/login');
      } else {
        console.log('Signup Error:', data);
        setError(data?.error?.message || 'Signup failed. Please try again.');
      }
    } catch (err) {
      console.error('Network Error:', err);
      setError('Something went wrong. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  return { signup, error, setError, loading };
};
