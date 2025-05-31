import React, { useState } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import TabHeader from "../../../Components/TabHeader";
import { useCartStore } from "../../../stores/useCartStore";
import { useStripe, CardField } from "@stripe/stripe-react-native";

export default function UserCart() {
  const cartItems = useCartStore((state) => state.cartItems);
  const clearCart = useCartStore((state) => state.clearCart);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const stripe = useStripe();

  const [showCardForm, setShowCardForm] = useState(false);
  const [cardDetails, setCardDetails] = useState(null);

  const handleCheckout = async () => {
    if (!cardDetails?.complete) {
      Alert.alert("Invalid Card", "Please enter complete card details.");
      return;
    }

    try {
      const response = await fetch(
        "http://192.168.100.98:1337/api/payment-intent",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: Math.round(totalAmount * 100),
            currency: "usd",
          }),
        }
      );

      const { clientSecret } = await response.json();

      if (!clientSecret) {
        Alert.alert("Error", "Unable to initiate payment.");
        return;
      }

      const { error, paymentIntent } = await stripe.confirmPayment(
        clientSecret,
        {
          paymentMethodType: "Card",
        }
      );

      if (error) {
        Alert.alert("Payment failed", error.message);
      } else if (paymentIntent) {
        Alert.alert("Success", "Payment completed!");
        clearCart();
        setShowCardForm(false);
        setCardDetails(null);
      }
    } catch (err) {
      console.error("Checkout error:", err);
      Alert.alert("Error", "Something went wrong during checkout.");
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemCard}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
      </View>
      <Text style={styles.itemPrice}>₨ {item.price * item.quantity}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <TabHeader title="Cart" />

      {cartItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Your cart is empty</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll}>
          <FlatList
            data={cartItems}
            keyExtractor={(item) => item.id.toString()}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
            scrollEnabled={false}
          />

          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: ₨ {totalAmount}</Text>

            {!showCardForm ? (
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={() => setShowCardForm(true)}
              >
                <Text style={styles.checkoutText}>Checkout</Text>
              </TouchableOpacity>
            ) : (
              <>
                <View style={styles.cardSection}>
                  <Text style={styles.inputLabel}>Enter Card Details</Text>
                  <CardField
                    postalCodeEnabled={false}
                    placeholder={{ number: "4242 4242 4242 4242" }}
                    cardStyle={{
                      backgroundColor: "#FFFFFF",
                      textColor: "#000000",
                    }}
                    style={styles.cardContainer}
                    onCardChange={(details) => setCardDetails(details)}
                  />
                </View>
                <TouchableOpacity
                  style={styles.confirmButton}
                  onPress={handleCheckout}
                >
                  <Text style={styles.confirmText}>Pay Now</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </ScrollView>
      )}
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf3",
  },
  scroll: {
    paddingBottom: 60,
  },
  listContent: {
    padding: 16,
  },
  itemCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2d2f31",
  },
  itemQuantity: {
    fontSize: 14,
    color: "#666",
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: "700",
    color: "#6a994e",
  },
  totalContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fffaf3",
  },
  totalText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#3e403f",
  },
  checkoutButton: {
    backgroundColor: "#6a994e",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
  },
  checkoutText: {
    color: "#fffaf3",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardSection: {
    marginTop: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: "500",
    color: "#2d2f31",
  },
  cardContainer: {
    height: 50,
    marginBottom: 16,
  },

  confirmButton: {
    backgroundColor: "#6a994e",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  confirmText: {
    color: "#fffaf3",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#999",
  },
});
