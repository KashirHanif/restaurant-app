import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import BASE_URL from "../constants/constants";

export const useFeedbackPrompt = () => {
  const [pendingFeedbackOrder, setPendingFeedbackOrder] = useState(null);

  useEffect(() => {
    const checkForPendingFeedback = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        const userData = await AsyncStorage.getItem("userData");
        const userId = JSON.parse(userData)?.id;

        // Step 1: Get latest 'served' order
        const res = await fetch(
          `${BASE_URL}/api/orders?filters[user][id][$eq]=${userId}&filters[order_status][$eq]=served&sort=createdAt:desc&populate=feedbacks`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const { data } = await res.json();
        if (!Array.isArray(data) || data.length === 0) return;

        const latestOrder = data[0];
        const hasFeedback = (latestOrder.feedbacks || []).length > 0;
        const shownKey = `feedback_shown_${latestOrder.documentId}`;
        const alreadyShown = await AsyncStorage.getItem(shownKey);

        // Step 2: If feedback not given and not shown yet
        if (!hasFeedback && !alreadyShown) {
          // Now fetch restaurant details using order.documentId
          const restaurantRes = await fetch(
            `${BASE_URL}/api/orders/${latestOrder.documentId}?populate=restaurant`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const fullOrder = await restaurantRes.json();
          const orderWithRestaurant = {
            ...latestOrder,
            restaurant: fullOrder?.data?.restaurant || null,
          };

          setPendingFeedbackOrder(orderWithRestaurant);
        }
      } catch (error) {
        console.error("Failed to check feedback prompt", error);
      }
    };

    checkForPendingFeedback();
  }, []);

  return { pendingFeedbackOrder, setPendingFeedbackOrder };
};
