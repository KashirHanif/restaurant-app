// app/(admin)/admin-profile.jsx

import { StyleSheet, Text, View } from 'react-native';

export default function AdminProfile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Admin profile screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
  },
});
