import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import MenuCard from '../../../Components/MenuCard';


export default function UserMenu() {
  const { url } = useLocalSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!url) return;
    const fetchMenuItems = async () => {
      try {
        setLoading(true);
        const decodedUrl = decodeURIComponent(url);
        const response = await fetch(decodedUrl);
        const result = await response.json();
        if (Array.isArray(result.data)) {
          const parsed = result.data.map((item) => ({
            id: item.id,
            name: item.name || '',
            price: item.price || '',
            category: item.category || '',
            description: item.description || [],
          }));
          setItems(parsed);
        } else {
          Alert.alert('No items found');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to fetch menu items');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [url]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Menu</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#6a994e" />
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => <MenuCard item={item} />}
          ListEmptyComponent={
            <Text style={{ textAlign: 'center', marginTop: 20 }}>
              No menu items found.
            </Text>
          }
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
    paddingTop: 40,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#3e403f',
    textAlign: 'center',
    marginBottom: 20,
  },
});
