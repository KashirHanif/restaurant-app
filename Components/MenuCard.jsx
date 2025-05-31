import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useCartStore } from '../stores/useCartStore'; // adjust path as needed

export default function MenuCard({ item }) {
  const { cartItems, addToCart, updateQuantity } = useCartStore();
  const cartItem = cartItems.find((ci) => ci.id === item.id);
  const count = cartItem?.quantity || 0;

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.cardTitle}>{item.name}</Text>

        <View style={styles.infoRow}>
          <Text style={styles.price}>₨ {item.price}</Text>
          {item.category && (
            <Text style={styles.category}>{item.category}</Text>
          )}
        </View>

        {Array.isArray(item.description) && item.description.length > 0 && (
          <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
            {item.description
              .map((block) =>
                block?.children?.map((child) => child.text).join('')
              )
              .join('\n')}
          </Text>
        )}
      </View>

      {/* Counter & Buttons */}
      <View style={styles.counterContainer}>
        <Text style={styles.counterText}>{count}</Text>
        <View style={styles.buttonsRow}>
          <TouchableOpacity
            style={styles.buttonMinus}
            activeOpacity={0.7}
            onPress={() => updateQuantity(item.id, count - 1)}
            disabled={count === 0}
          >
            <Text style={styles.buttonText}>-</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttonPlus}
            activeOpacity={0.7}
            onPress={() => addToCart(item)}
          >
            <Text style={styles.buttonText}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 20,
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#6a994e',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 6,
  },
  content: {
    flex: 1,
  },
  cardTitle: {
    fontWeight: '800',
    fontSize: 22,
    color: '#2d2f31',
    marginBottom: 6,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'center',
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#556B2F',
    marginRight: 16,
  },
  category: {
    fontSize: 14,
    color: '#8a8a8a',
    fontStyle: 'italic',
  },
  description: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  counterContainer: {
    alignItems: 'center',
    marginLeft: 20,
  },
  counterText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#556B2F',
    marginBottom: 10,
  },
  buttonsRow: {
    flexDirection: 'row',
  },
  buttonMinus: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#999',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonPlus: {
    backgroundColor: '#556B2F',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 14,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2a3c12',
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 5 },
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
  },
});
