// app/user-profile.jsx
import { StyleSheet, Text, View } from 'react-native';

export default function UserProfile() {
  return (
    <View style={styles.container}>
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
  text: {
    fontSize: 18
  }
});
