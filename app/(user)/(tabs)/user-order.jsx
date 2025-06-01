import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TabHeader from "../../../Components/TabHeader";
import { useOrderStore } from "../../../stores/useOrderStore";

export default function UserOrder() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  const setOrdersStore = useOrderStore((state) => state.setOrders);

  const getStatusColor = (status) => {
    switch (status) {
      case "processing":
        return "#FFA500"; // Orange
      case "preparing":
        return "#1E90FF"; // Blue
      case "prepared":
        return "#32CD32"; // Green
      default:
        return "#808080"; // Grey
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      const userId = JSON.parse(userData)?.id;

      const response = await fetch(
        `http://192.168.100.98:1337/api/orders?filters[user][id][$eq]=${userId}&populate[order_items][populate]=menu_item`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await response.json();

      if (Array.isArray(result.data)) {
        // ✅ Filter out orders with status "served"
        const filteredOrders = result.data.filter(
          (order) => order?.order_status !== "served"
        );

        setOrders(filteredOrders);
        setOrdersStore(filteredOrders);
      } else {
        Alert.alert("No orders found");
      }
    } catch (err) {
      Alert.alert("Error", "Failed to fetch orders");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const renderOrder = ({ item }) => {
    const status = item?.order_status;
    const total = item?.total_price;
    const date = new Date(item?.createdAt || item?.updatedAt).toLocaleString();
    const isExpanded = expandedOrderId === item.id;

    const toggleExpand = () => {
      setExpandedOrderId(isExpanded ? null : item.id);
    };

    return (
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.9}
        style={[styles.card, { borderLeftColor: getStatusColor(status) }]}
      >
        <Text style={styles.title}>Order #{item.id}</Text>
        <Text style={styles.label}>
          Status:{" "}
          <Text style={{ color: getStatusColor(status), fontWeight: "bold" }}>
            {status}
          </Text>
        </Text>
        <Text style={styles.label}>Total: ₨ {total}</Text>
        <Text style={styles.date}>{date}</Text>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <Text style={[styles.label, { marginTop: 12 }]}>Items:</Text>
            {(item?.order_items || []).map((orderItem, idx) => {
              const menuItem = orderItem?.menu_item;
              const itemName = menuItem?.name || "Unnamed item";

              return (
                <View key={idx} style={{ marginLeft: 8, marginTop: 4 }}>
                  <Text>
                    • {itemName} — Qty: {orderItem.quantity}
                  </Text>
                </View>
              );
            })}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TabHeader title="Orders" />
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#6a994e"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No orders placed yet.</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf3",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginBottom: 12,
    borderRadius: 10,
    borderLeftWidth: 6,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#3e403f",
  },
  label: {
    fontSize: 15,
    marginTop: 6,
    color: "#3e403f",
  },
  date: {
    fontSize: 13,
    marginTop: 4,
    color: "#707070",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "#707070",
  },
  expandedSection: {
    marginTop: 10,
    backgroundColor: "#f9f9f9",
    padding: 10,
    borderRadius: 6,
  },
});
