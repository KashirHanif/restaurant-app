import { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import BASE_URL from "../constants/constants";

const FeedbackModal = ({ order, onClose }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  console.log("Order: ", order);
  const [submitted, setSubmitted] = useState(false);

  const submitFeedback = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      const userData = await AsyncStorage.getItem("userData");
      const userId = JSON.parse(userData)?.id;

      const payload = {
        data: {
          rating,
          comment,
          user: userId,
          restaurant: {
            connect: [{ documentId: order.restaurant.documentId }],
          },
          order: { connect: [{ documentId: order.documentId }] },
        },
      };

      const res = await fetch(`${BASE_URL}/api/feedbacks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to submit feedback");
      }

      // Mark feedback as shown
      await AsyncStorage.setItem(`feedback_shown_${order.documentId}`, "true");

      // Show thank you briefly, then close modal
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 2000); // 2 seconds
    } catch (err) {
      console.error("Feedback submit failed", err);
    }
  };

  return (
    <Modal visible animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {submitted ? (
            <Text style={styles.thankYou}>🎉 Thank you for your feedback!</Text>
          ) : (
            <>
              <Text style={styles.title}>
                How was your experience at {order?.restaurant?.name}?
              </Text>

              <View style={styles.stars}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <TouchableOpacity key={i} onPress={() => setRating(i)}>
                    <Ionicons
                      name={i <= rating ? "star" : "star-outline"}
                      size={30}
                      color="#f4c430"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <TextInput
                placeholder="Write a comment (optional)"
                style={styles.input}
                value={comment}
                onChangeText={setComment}
                multiline
              />

              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.skipBtn} onPress={onClose}>
                  <Text style={styles.btnText}>Skip</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={submitFeedback}
                  disabled={rating === 0}
                >
                  <Text style={styles.btnText}>Submit</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "#000000aa",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "90%",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
  },
  stars: {
    flexDirection: "row",
    marginBottom: 16,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    minHeight: 80,
    textAlignVertical: "top",
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  skipBtn: {
    backgroundColor: "#999",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  submitBtn: {
    backgroundColor: "#6a994e",
    padding: 10,
    borderRadius: 6,
    flex: 1,
    marginLeft: 8,
    alignItems: "center",
  },
  btnText: {
    color: "#fff",
    fontWeight: "bold",
  },
  thankYou: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    paddingVertical: 30,
    color: "#1b4332",
  },
});
