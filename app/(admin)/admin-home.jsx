import { StyleSheet, Text, View } from 'react-native';

export default function AdminHome() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>admin-home</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3e403f',
  },
});
