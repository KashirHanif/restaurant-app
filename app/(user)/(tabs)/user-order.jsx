import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
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
} from "react-native";
import TabHeader from "../../../Components/TabHeader";
import { useOrderStore } from "../../../stores/useOrderStore";

// Enable LayoutAnimation on Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

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
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setExpandedOrderId(isExpanded ? null : item.id);
    };

    return (
      <TouchableOpacity
        onPress={toggleExpand}
        activeOpacity={0.9}
        style={[
          styles.card,
          { borderLeftColor: getStatusColor(status) },
          isExpanded && styles.cardExpanded,
        ]}
      >
        <View style={styles.cardHeader}>
          <Text style={styles.title}>Order #{item.id}</Text>
          <Text style={[styles.status, { color: getStatusColor(status) }]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <Text style={styles.label}>Total: ₨ {total}</Text>
          <Text style={styles.date}>{date}</Text>
        </View>

        {isExpanded && (
          <View style={styles.expandedSection}>
            <Text style={styles.itemsTitle}>Items:</Text>
            {(item?.order_items || []).map((orderItem, idx) => {
              const menuItem = orderItem?.menu_item;
              const itemName = menuItem?.name || "Unnamed item";
              const prepTime = menuItem?.time_for_preparation ?? null;

              return (
                <View key={idx} style={styles.itemRow}>
                  <Text style={styles.itemText}>
                    • {itemName} — Qty: {orderItem.quantity}
                    {prepTime !== null ? ` — Prep Time: ${prepTime} min` : ""}
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
        <ActivityIndicator size="large" color="#6a994e" style={styles.loader} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderOrder}
          contentContainerStyle={styles.listContent}
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
    backgroundColor: "#fdfdfd",
  },
  loader: {
    marginTop: 40,
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 16,
    marginBottom: 16,
    borderRadius: 12,
    borderLeftWidth: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 2,
  },
  cardExpanded: {
    backgroundColor: "#f9f9f9",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2d2f31",
  },
  status: {
    fontSize: 14,
    fontWeight: "500",
  },
  cardBody: {
    marginTop: 8,
  },
  label: {
    fontSize: 15,
    color: "#3e403f",
  },
  date: {
    fontSize: 13,
    marginTop: 4,
    color: "#707070",
  },
  expandedSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 12,
  },
  itemsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d2f31",
    marginBottom: 8,
  },
  itemRow: {
    marginLeft: 8,
    marginTop: 4,
  },
  itemText: {
    fontSize: 14,
    color: "#3e403f",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 60,
    fontSize: 16,
    color: "#707070",
  },
});
