import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    LayoutAnimation,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    UIManager,
    View,
} from 'react-native';
import TabHeader from '../../Components/TabHeader';
import BASE_URL from '../../constants/constants';

if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export default function AdminOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const ordersRef = useRef([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'processing':
        return '#FFA500';
      case 'preparing':
        return '#1E90FF';
      case 'prepared':
        return '#D00000';
      default:
        return '#808080';
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      const restaurantData = JSON.parse(
        await AsyncStorage.getItem('restaurantData')
      );
      const documentId = restaurantData?.documentId;

      if (!documentId) {
        Alert.alert('Setup Incomplete', 'Restaurant not configured.');
        return;
      }

      const response = await fetch(
        `${BASE_URL}/api/orders?filters[restaurant][documentId][$eq]=${documentId}&populate[order_items][populate]=menu_item`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      const unserved = result.data?.filter(
        (order) =>
          order?.order_items?.length > 0 &&
          order?.total_price > 0 &&
          order?.order_status !== 'served'
      );

      setOrders(unserved || []);
    } catch (error) {
      console.error('Error fetching admin orders:', error);
      Alert.alert('Error', 'Failed to load orders.');
    } finally {
      setLoading(false);
    }
  };

  const markOrderAsServed = async (orderId) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const order = orders.find((o) => o.id === orderId);

      if (!order?.documentId) {
        Alert.alert('Error', 'Order missing documentId');
        return;
      }

      const response = await fetch(`${BASE_URL}/api/orders/${order.documentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ data: { order_status: 'served' } }),
      });

      if (response.ok) {
        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
        setOrders((prev) => prev.filter((o) => o.id !== orderId));
      } else {
        Alert.alert('Error', 'Failed to update order.');
      }
    } catch (err) {
      console.error('Order update failed:', err);
      Alert.alert('Error updating order.');
    }
  };

  const toggleExpand = (id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  const renderOrder = ({ item }) => {
    const isExpanded = item.id === expandedOrderId;
    const date = new Date(item.createdAt).toLocaleString();

    const createdAt = new Date(item.createdAt);
    const now = new Date();
    const elapsed = Math.floor((now - createdAt) / 60000);
    const prepTimes = item.order_items.map(
      (i) => i?.menu_item?.time_for_preparation || 30
    );
    const maxPrepTime = Math.max(...prepTimes);
    const totalCountdown = 2 + maxPrepTime;
    const progress = Math.min(100, Math.floor((elapsed / totalCountdown) * 100));

    return (
      <TouchableOpacity
        onPress={() => toggleExpand(item.id)}
        activeOpacity={0.9}
        style={[
          styles.card,
          isExpanded && styles.cardExpanded,
          item.order_status === 'prepared' && styles.urgentCard,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Order #{item.order_number}</Text>
          <Text style={[styles.status, { color: getStatusColor(item.order_status) }]}>
            {item.order_status.charAt(0).toUpperCase() + item.order_status.slice(1)}
          </Text>
        </View>

        <View style={styles.cardBody}>
          <Text style={styles.label}>Total: ₨ {item.total_price}</Text>
          <Text style={styles.date}>{date}</Text>

          {(item.order_status === 'processing' ||
            item.order_status === 'preparing') && (
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          )}
        </View>

        {isExpanded && (
          <>
            <View style={styles.expandedSection}>
              <Text style={styles.itemsTitle}>Items:</Text>
              {item.order_items?.map((orderItem, idx) => {
                const menuItem = orderItem?.menu_item;
                return (
                  <Text key={idx} style={styles.itemText}>
                    • {menuItem?.name || 'Unnamed'} — Qty: {orderItem.quantity}
                  </Text>
                );
              })}
            </View>

            <TouchableOpacity
              style={[
                styles.completeBtn,
                item.order_status === 'prepared' && styles.urgentButton,
              ]}
              onPress={() => markOrderAsServed(item.id)}
            >
              <Text style={styles.completeText}>Order Completed</Text>
            </TouchableOpacity>
          </>
        )}
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    ordersRef.current = orders;
  }, [orders]);

  return (
    <View style={styles.container}>
      <TabHeader title="Admin Orders" />
      {loading ? (
        <ActivityIndicator size="large" color="#6a994e" style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No active orders found.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fdfdfd' },
  loader: { marginTop: 40 },
  listContent: { padding: 16 },
  card: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
    borderLeftColor: '#6a994e',
  },
  urgentCard: {
    backgroundColor: '#ffe5e5',
    borderLeftColor: '#ff4d4d',
    shadowColor: '#ff4d4d',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardExpanded: { backgroundColor: '#f9f9f9' },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { fontSize: 18, fontWeight: '600', color: '#2d2f31' },
  status: { fontSize: 14, fontWeight: '500' },
  cardBody: { marginTop: 8 },
  label: { fontSize: 15, color: '#3e403f' },
  date: { fontSize: 13, marginTop: 4, color: '#707070' },
  progressBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6a994e',
  },
  expandedSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingTop: 12,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d2f31',
    marginBottom: 8,
  },
  itemText: { fontSize: 14, color: '#3e403f', marginBottom: 4 },
  completeBtn: {
    marginTop: 16,
    backgroundColor: '#6a994e',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  urgentButton: {
    backgroundColor: '#d00000',
  },
  completeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 60,
    fontSize: 16,
    color: '#707070',
  },
});
