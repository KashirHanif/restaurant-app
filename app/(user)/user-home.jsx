import AsyncStorage from "@react-native-async-storage/async-storage";
import { CameraView, useCameraPermissions } from "expo-camera";
import { useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function UserHome() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const alertShown = useRef(false); // 🛡️ Alert guard

  useEffect(() => {
    if (!permission || !permission.granted) {
      requestPermission();
    }
  }, [permission]);

 const handleBarcodeScanned = async ({ data }) => {
  if (alertShown.current) return;
  alertShown.current = true;
  setScanned(true);

  try {
    const isValid =
      typeof data === "string" &&
      data.includes("http") &&
      data.includes("/api/");

    if (!isValid) {
      setScanned(false);
      Alert.alert("Invalid QR", "The scanned QR code is not valid.", [
        {
          text: "OK",
          onPress: () => {
            alertShown.current = false;
          },
        },
      ]);
      return;
    }

    const token = await AsyncStorage.getItem("userToken");
    const userData = await AsyncStorage.getItem("userData");
    const role = userData ? JSON.parse(userData).role?.toLowerCase() : null;

    if (!token || role !== "customer") {
      await AsyncStorage.setItem("pendingMenuURL", data);
      Alert.alert("Login Required", "Please log in to view the menu.", [
        {
          text: "Go to Login",
          onPress: () => {
            router.replace("/(auth)/login");
          },
        },
      ]);
      return;
    }

    const url = new URL(data);
    const restaurantDocId = url.searchParams.get("filters[restaurant][documentId][$eq]");
    const tableNumber = url.searchParams.get("table");

    if (!restaurantDocId || !tableNumber) {
      Alert.alert("Error", "Invalid QR Code structure.");
      return;
    }

    // Step 1: Get restaurant ID from documentId
    const restaurantRes = await fetch(
      `http://192.168.100.92:1337/api/restaurants?filters[documentId][$eq]=${restaurantDocId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const restaurantData = await restaurantRes.json();
    const restaurantId = restaurantData?.data?.[0]?.id;

    if (!restaurantId) {
      Alert.alert("Error", "Restaurant not found.");
      return;
    }

    // Step 2: Get table by resolved restaurant ID + table number
    const tableRes = await fetch(
      `http://192.168.100.92:1337/api/tables?filters[restaurant][id][$eq]=${restaurantId}&filters[table_number][$eq]=${tableNumber}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    const tableData = await tableRes.json();
    const tableDocId = tableData?.data?.[0]?.documentId;

    if (!tableDocId) {
      Alert.alert("Error", "Table not found.");
      return;
    }

    
    await AsyncStorage.setItem("restaurantDocumentId", restaurantDocId);
    await AsyncStorage.setItem("tableDocumentId", tableDocId);

    // Navigate to menu
    router.push({
      pathname: "user-menu",
      params: { url: encodeURIComponent(data) },
    });
  } catch (error) {
    console.error("QR Scan Error:", error);
    setScanned(false);
    Alert.alert("Error", "Something went wrong. Please try again.", [
      {
        text: "OK",
        onPress: () => {
          alertShown.current = false;
        },
      },
    ]);
  }
};

  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.heading}>Camera access is required</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Scan QR Code</Text>
      <View style={styles.scannerContainer}>
        <CameraView
          barcodeScannerSettings={{
            barcodeTypes: ["qr"],
          }}
          onBarcodeScanned={scanned ? undefined : handleBarcodeScanned}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      {scanned && (
        <TouchableOpacity
          onPress={() => setScanned(false)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Scan Again</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.profileButton}
        onPress={async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            const userData = await AsyncStorage.getItem("userData");
            const role = userData
              ? JSON.parse(userData).role?.toLowerCase()
              : null;

            if (token && role === "customer") {
              router.push("/user-profile");
            } else {
              router.replace("/(auth)/login");
            }
          } catch (err) {
            console.error("Navigation error:", err);
            router.replace("/login");
          }
        }}
      >
        <Text style={styles.profileButtonText}>Or go to user profile</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  heading: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  scannerContainer: {
    height: 300,
    width: 300,
    overflow: "hidden",
    borderRadius: 20,
    borderColor: "#ff6f00",
    borderWidth: 4,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#ff6f00",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  profileButton: {
    position: "absolute",
    bottom: 40,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  profileButtonText: {
    color: "#ff6f00",
    fontWeight: "bold",
    fontSize: 16,
  },
});
