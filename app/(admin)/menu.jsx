import { Feather, Ionicons } from "@expo/vector-icons";
import * as MediaLibrary from "expo-media-library";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";

import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";



export default function Menu() {
  const [items, setItems] = useState([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [loading, setLoading] = useState(false);
  const [prepTime, setPrepTime] = useState("");


  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState(null); // holds parsed restaurant

  const [qrTables, setQrTables] = useState([]);
  const qrRefs = {}; // Object to hold refs per table number

  const router = useRouter();

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const getErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (typeof error === "object") {
      if (error.message) return error.message;
      if (error.error && typeof error.error === "string") return error.error;
      return JSON.stringify(error);
    }
    return "Unknown error occurred";
  };

  const fetchMenuItems = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem("userToken");
      const restaurantData = await AsyncStorage.getItem("restaurantData");
      const parsedRestaurant = JSON.parse(restaurantData);
      setRestaurantInfo(parsedRestaurant);
      const restaurantId = parsedRestaurant?.documentId;
      if (!token) {
        Alert.alert("Error", "User not authenticated");
        return;
      }

      const response = await fetch(
        `http://192.168.100.92:1337/api/menu-items?filters[restaurant][documentId][$eq]=${restaurantId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await response.json();

      if (response.ok && Array.isArray(result.data)) {
        const items = result.data.map((item) => ({
          id: item.id,
          name: item.name || "",
          price: item.price || "",
          category: item.category || "",
          description: item.description || [],
          documentId: item.documentId,
        }));
        setItems(items);
      } else {
        Alert.alert(
          "Error",
          result.error?.message || "Failed to fetch menu items"
        );
      }
    } catch (error) {
      Alert.alert("Error", "Unable to fetch menu items");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

const resetForm = () => {
  setName("");
  setPrice("");
  setCategory("");
  setDescription("");
  setPrepTime(""); // Resetting the new field
  setIsAdding(false);
  setEditIndex(null);
};


  const handleAddOrUpdate = async () => {
    if (!name.trim() || !price.trim()) {
      Alert.alert("Validation", "Please enter at least name and price.");
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    const restaurantData = await AsyncStorage.getItem("restaurantData");

    if (!token || !restaurantData) {
      Alert.alert(
        "Profile Missing",
        "Please complete your restaurant profile first.",
        [
          {
            text: "Go to Profile",
            onPress: () => router.replace("/admin-profile"),
          },
        ]
      );
      return;
    }
    const parsedRestaurant = JSON.parse(restaurantData);
    const restaurantId = parsedRestaurant?.documentId;
    setLoading(true);

const itemData = {
  name,
  price: Number(price),
  category,
  description: description
    ? [
        {
          type: "paragraph",
          children: [{ type: "text", text: description }],
        },
      ]
    : [],
  restaurant: restaurantId,
  time_for_preparation: prepTime, // New field added here
};

    try {
      let response, result;

      if (editIndex !== null) {
        const itemId = items[editIndex]?.documentId;

        response = await fetch(
          `http://192.168.100.92:1337/api/menu-items/${itemId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: itemData }),
          }
        );

        result = await response.json();

        if (response.ok) {
          Alert.alert("Success", "Menu item updated");
          await fetchMenuItems();
        } else {
          Alert.alert("Error", result.error?.message || "Update failed");
        }
      } else {
        response = await fetch("http://192.168.100.92:1337/api/menu-items", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ data: itemData }),
        });

        result = await response.json();

        if (response.ok) {
          Alert.alert("Success", "Menu item added");
          await fetchMenuItems();
        } else {
          Alert.alert("Error", result.error?.message || "Creation failed");
        }
      }
    } catch (error) {
      Alert.alert("Error", "Server error while saving");
      console.error(error);
    }

    setLoading(false);
    resetForm();
  };

const handleEdit = (index) => {
  const item = items[index];
  setName(item.name);
  setPrice(String(item.price));
  setCategory(item.category || "");
  const richText = item.description;
  let plainDescription = "";
  if (Array.isArray(richText)) {
    plainDescription = richText
      .map((block) =>
        Array.isArray(block.children)
          ? block.children.map((child) => child.text).join("")
          : ""
      )
      .join("\n");
  }
  setDescription(plainDescription);
  setPrepTime(item.time_for_preparation || ""); // Populate the new field
  setEditIndex(index);
  setIsAdding(true);
};


  const handleDelete = (index) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this menu item?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteMenuItem(index),
        },
      ]
    );
  };

  const deleteMenuItem = async (index) => {
    const itemId = items[index]?.documentId;
    const restaurantData = await AsyncStorage.getItem("restaurantData");
    const restaurantId = restaurantData ? JSON.parse(restaurantData)?.id : null;

    if (!itemId || !restaurantId) {
      Alert.alert("Error", "Missing item or restaurant ID");
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    if (!token) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      const response = await fetch(
        `http://192.168.100.92:1337/api/menu-items/${itemId}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.status === 204) {
        Alert.alert("Deleted", "Menu item deleted");
        fetchMenuItems();
      } else {
        const result = await response.json();
        Alert.alert("Error", result.error?.message || "Delete failed");
      }
    } catch (err) {
      Alert.alert("Error", "Server error");
      console.error(err);
    }
  };

  const generateQrCodes = async () => {
  try {
    setLoading(true);
    const token = await AsyncStorage.getItem("userToken");
    const restaurantData = await AsyncStorage.getItem("restaurantData");
    const parsedRestaurant = restaurantData ? JSON.parse(restaurantData) : null;

    if (!token || !parsedRestaurant?.documentId) {
      Alert.alert("Missing data", "User token or restaurant profile is not available.");
      return;
    }

    const restaurantDocId = parsedRestaurant.documentId;

    // 🔄 1️⃣ Fetch the latest profile from Strapi to get the current number_of_tables
    const profileRes = await fetch(
      `http://192.168.100.92:1337/api/restaurants?filters[documentId][$eq]=${restaurantDocId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const profileData = await profileRes.json();
    const latestProfile = profileData?.data?.[0];
    const numTables = Number(latestProfile?.number_of_tables);
    
    if (!numTables) {
      Alert.alert("Error", "Failed to retrieve the number of tables.");
      return;
    }

    // 🧾 2️⃣ Fetch existing QR tables
    const existingRes = await fetch(
      `http://192.168.100.92:1337/api/tables?filters[restaurant][documentId][$eq]=${restaurantDocId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const existingData = await existingRes.json();
    const existingTables = existingData?.data || [];

    // ✅ 3️⃣ Skip regeneration if same table count
    if (existingTables.length === numTables) {
      setQrTables(existingTables);
      Alert.alert("QR Codes Already Exist", "Using previously generated QR codes.", [
        {
          text: "View PDF",
          onPress: () => handleGeneratePdf(),
        },
        {
          text: "Close",
          style: "cancel",
        },
      ]);
      return;
    }

    // 🗑 4️⃣ Delete existing tables if count mismatches
    if (existingTables.length > 0) {
      const deletePromises = existingTables.map((table) =>
        fetch(`http://192.168.100.92:1337/api/tables/${table.documentId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
      );
      await Promise.all(deletePromises);
    }

    await new Promise((res) => setTimeout(res, 300)); // Optional wait to avoid race condition

    // 🆕 5️⃣ Create new tables
    const creationPromises = [];

    for (let tableNum = 1; tableNum <= numTables; tableNum++) {
      const qrUrl = `http://192.168.100.92:1337/api/menu-items?filters[restaurant][documentId][$eq]=${restaurantDocId}&table=${tableNum}`;

      const tablePayload = {
        data: {
          table_number: tableNum,
          qr_code_url: qrUrl,
          restaurant: restaurantDocId,
        },
      };
      
      
      creationPromises.push(
        fetch("http://192.168.100.92:1337/api/tables", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tablePayload),
        })
      );
    }

    await Promise.all(creationPromises);

    // 🔄 6️⃣ Refetch final table list
    const finalRes = await fetch(
      `http://192.168.100.92:1337/api/tables?filters[restaurant][documentId][$eq]=${restaurantDocId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const finalData = await finalRes.json();
    setQrTables(finalData?.data || []);

    Alert.alert("Success", "QR Codes regenerated!", [
      {
        text: "View PDF",
        onPress: () => handleGeneratePdf(),
      },
      {
        text: "Close",
        style: "cancel",
      },
    ]);
  } catch (err) {
    console.error("QR code generation error:", err);
    Alert.alert("Error", "Failed to generate QR codes.");
  } finally {
    setLoading(false);
  }
};



  const handleGeneratePdf = async () => {
  try {
    let htmlContent = `
      <html>
        <body style="padding: 20px; font-family: sans-serif;">
    `;

    for (const table of qrTables) {
      const qrUrl = table?.qr_code_url;
      const tableNum = table?.table_number;

      // Generate QR image via public QR generator
      const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrUrl)}`;

      htmlContent += `
        <div style="margin-bottom: 40px;">
          <h2>Table ${tableNum}</h2>
          <img src="${qrImageUrl}" width="150" height="150" />
        </div>
      `;
    }

    htmlContent += `</body></html>`;

    const { uri } = await Print.printToFileAsync({ html: htmlContent });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri);
    } else {
      const permission = await MediaLibrary.requestPermissionsAsync();
      if (permission.granted) {
        const asset = await MediaLibrary.createAssetAsync(uri);
        await MediaLibrary.createAlbumAsync("QR Codes", asset, false);
        Alert.alert("Saved", "PDF saved to your media folder.");
      } else {
        Alert.alert("Permission denied", "Cannot save PDF without permission.");
      }
    }
  } catch (err) {
    console.error("PDF generation failed", err);
    Alert.alert("Error", "Failed to generate PDF");
  }
};


  const renderItem = ({ item, index }) => (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <Text style={styles.cardText}>Price: ₨ {item.price}</Text>
        {item.category ? (
          <Text style={styles.cardText}>Category: {item.category}</Text>
        ) : null}
        {Array.isArray(item.description) && item.description.length > 0 && (
          <Text style={styles.cardText}>
            {item.description
              .map((block) =>
                block?.children?.map((child) => child.text).join("")
              )
              .join("\n")}
          </Text>
        )}
      </View>
      <View style={styles.cardButtons}>
<TouchableOpacity style={styles.editButton} onPress={() => handleEdit(index)}>
  <Feather name="edit-3" size={20} color="#fff" />
</TouchableOpacity>
<TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(index)}>
  <Feather name="trash-2" size={20} color="#fff" />
</TouchableOpacity>
      </View>
    </View>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.message}>No menu items found</Text>
    </View>
  );

return (
  <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : undefined}
    style={styles.container}
  >
    {loading && (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6a994e" />
      </View>
    )}

    {!isAdding ? (
      <>
        <FlatList
          data={items}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          contentContainerStyle={
            items.length === 0
              ? styles.flatListEmpty
              : { padding: 24, paddingBottom: 96 }
          }
          showsVerticalScrollIndicator={false}
        />

        <TouchableOpacity
          style={styles.qrFab}
          onPress={generateQrCodes}
          activeOpacity={0.7}
        >
          <Ionicons name="qr-code" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.fab}
          onPress={async () => {
            const restaurantData = await AsyncStorage.getItem("restaurantData");
            if (!restaurantData) {
              Alert.alert(
                "Complete Profile",
                "Please set your profile before adding menu items.",
                [
                  {
                    text: "Go to Profile",
                    onPress: () => router.replace("/(admin)/admin-profile"),
                  },
                  { text: "Cancel", style: "cancel" },
                ]
              );
              return;
            }

            setIsAdding(true);
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="add" size={28} color="#fff" />
        </TouchableOpacity>
      </>
    ) : (
      <View style={styles.form}>
        <Text style={styles.heading}>
          {editIndex !== null ? "Edit Menu Item" : "Add Menu Item"}
        </Text>

        <TextInput
          placeholder="Name"
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Price"
          style={styles.input}
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Category"
          style={styles.input}
          value={category}
          onChangeText={setCategory}
          placeholderTextColor="#888"
        />
        <TextInput
          placeholder="Description"
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholderTextColor="#888"
        />
        <TextInput
        placeholder="Time of Preparation (e.g., 30 minutes)"
        style={styles.input}
        value={prepTime}
        onChangeText={setPrepTime}
        placeholderTextColor="#888"
        />
        <TouchableOpacity
          style={styles.saveButton}
          onPress={handleAddOrUpdate}
          disabled={loading}
        >
          <Text style={styles.saveButtonText}>
            {editIndex !== null ? "Update" : "Add"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={resetForm} disabled={loading}>
          <Text style={styles.cancelText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    )}
  </KeyboardAvoidingView>
);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fffaf3",
    marginTop:20
  },
  flatListEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  emptyContainer: {
    alignItems: "center",
  },
  message: {
    fontSize: 16,
    color: "#444",
    marginBottom: 16,
    textAlign: "center",
  },
  form: {
    flex: 1,
    backgroundColor: '#fffaf3',
    padding: 24,
    justifyContent: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#3e403f",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f4eadd",
    padding: 14,
    borderRadius: 10,
    marginBottom: 16,
    fontSize: 16,
    color: "#3e403f",
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  saveButton: {
    backgroundColor: "#6a994e",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: "#fffaf3",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelText: {
    textAlign: "center",
    marginTop: 20,
    color: "#6c5c45",
    fontSize: 14,
  },

  // 🍽️ Stylish Menu Card
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 18,
    marginVertical: 12,
    marginHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
  },
  cardTitle: {
    fontWeight: "800",
    fontSize: 20,
    color: "#2d2f31",
    marginBottom: 6,
  },
  cardText: {
    fontSize: 14,
    color: "#3e403f",
    marginTop: 2,
  },
  cardButtons: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    gap: 10,
  },
  editButton: {
    backgroundColor: "#6a994e",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },
  deleteButton: {
    backgroundColor: "#d9534f",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 10,
  },

  // ➕ Floating Action Buttons
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    backgroundColor: "#6a994e",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  qrFab: {
    position: "absolute",
    bottom: 96,
    right: 24,
    backgroundColor: "#3e403f",
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: "#fffaf3",
    fontSize: 16,
    fontWeight: "bold",
  },
});

