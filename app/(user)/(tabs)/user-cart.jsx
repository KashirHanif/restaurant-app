import { StyleSheet, Text, View } from 'react-native';
import TabHeader from '../../../Components/TabHeader';

export default function UserCart() {
  return (
    <View style={styles.container}>
      <TabHeader title="Cart" />
      <View style={styles.content}>
        <Text style={styles.text}>This is user cart</Text>
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
    paddingTop: 60,
  },
  text: {
    fontSize: 18,
    color: '#3e403f',
  },
});
