import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import MenuCard from '../../../Components/MenuCard';
import TabHeader from '../../../Components/TabHeader';

const windowWidth = Dimensions.get('window').width;

export default function UserMenu() {
  const router = useRouter();
  const { url } = useLocalSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Example cart state, replace with your real cart logic/context
  const [cartCount, setCartCount] = useState(0);

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
            documentId:item.documentId,
            time_for_preparation: item.time_for_preparation || 30,
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

  // Dummy example: Simulate adding to cart (replace with your logic)
  // You can pass setCartCount to MenuCard or handle via global state

  return (
    <View style={styles.container}>
      <TabHeader title="Menu" />

      {loading ? (
        <ActivityIndicator size="large" color="#6a994e" style={{ marginTop: 20 }} />
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

      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.floatingCartButton}
          onPress={() => router.push('/(user)/user-cart')}
          activeOpacity={0.8}
        >
          <Text style={styles.floatingCartText}>Go to Cart ({cartCount})</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffaf3',
  },
  floatingCartButton: {
    position: 'absolute',
    bottom: 80, // adjust depending on your tab bar height + safe area
    alignSelf: 'center',
    width: windowWidth * 0.9,
    backgroundColor: '#6a994e',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#405222',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  floatingCartText: {
    color: '#fffaf3',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
