// Components/OrderCard.js

import { useState } from 'react';
import { LayoutAnimation, Platform, StyleSheet, Text, TouchableOpacity, UIManager, View } from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const statusColors = {
  processing: '#FFA500',
  preparing: '#1E90FF',
  prepared: '#32CD32',
  served: '#808080',
};

export default function OrderCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  const statusColor = statusColors[order?.order_status] || '#999';
  const date = new Date(order?.createdAt || order?.updatedAt).toLocaleString();

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <TouchableOpacity
      onPress={toggleExpand}
      activeOpacity={0.9}
      style={[styles.card, { borderLeftColor: statusColor }]}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Order #{order.id}</Text>
        <View style={[styles.statusBadge, { backgroundColor: statusColor }]}>
          <Text style={styles.statusText}>{order.order_status}</Text>
        </View>
      </View>

      <Text style={styles.meta}>Total: ₨ {order.total_price}</Text>
      <Text style={styles.meta}>Placed: {date}</Text>

      {expanded && (
        <View style={styles.details}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {(order?.order_items || []).map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <Text style={styles.itemText}>• {item.menu_item?.name || 'Unnamed item'}</Text>
              <Text style={styles.itemQty}>Qty: {item.quantity}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#2d2f31',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  meta: {
    fontSize: 14,
    color: '#555',
    marginTop: 6,
  },
  details: {
    marginTop: 12,
    backgroundColor: '#f9f9f9',
    padding: 12,
    borderRadius: 8,
  },
  itemsTitle: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  itemText: {
    fontSize: 14,
    color: '#444',
  },
  itemQty: {
    fontSize: 14,
    color: '#888',
  },
});
