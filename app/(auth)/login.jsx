import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Haptics from "expo-haptics";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ForkcastLogo from "../../assets/images/Forkcast-logo.png";
import BASE_URL from "../../constants/constants";
import { registerPushToken } from "../../utils/registerPushToken"; // ✅ Import the utility

export default function Login() {
  const router = useRouter();
  const { role } = useLocalSearchParams();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState(null);

  const validateEmail = (email) =>
    /^\w+([.-]?\w+)@\w+([.-]?\w+)(\.\w{2,3})+$/.test(email);

  const handleLogin = async () => {
    Keyboard.dismiss();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (!validateEmail(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/auth/local/custom-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: email,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error?.message || "Login failed");
      }

      const { jwt, user, restaurant } = data;

      await AsyncStorage.setItem("userToken", jwt);
      await AsyncStorage.setItem("userData", JSON.stringify(user));

      if (restaurant) {
        await AsyncStorage.setItem(
          "restaurantData",
          JSON.stringify(restaurant)
        );
      } else {
        await AsyncStorage.removeItem("restaurantData");
      }

      setError("");

      const role = user?.role?.toLowerCase();

      if (role === "customer") {
        // ✅ Register push token for customers only
        await registerPushToken(user.id);

        const pendingUrl = await AsyncStorage.getItem("pendingMenuURL");
        if (pendingUrl) {
          await AsyncStorage.removeItem("pendingMenuURL");
          router.replace({
            pathname: "/(user)/user-menu",
            params: { url: encodeURIComponent(pendingUrl) },
          });
          return;
        }
        router.replace("/(user)/user-home");
      } else {
        router.replace("/(admin)/admin-home");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong");
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/landing-page-bg.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.container}
        >
          <View style={styles.overlay}>
            <View style={styles.logoWrapper}>
              <Image
                source={ForkcastLogo}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.title}>Welcome Back</Text>

            <TextInput
              placeholder="Email"
              style={[
                styles.input,
                focusedField === "email" && styles.inputFocused,
              ]}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholderTextColor="#888"
            />

            <TextInput
              placeholder="Password"
              style={[
                styles.input,
                focusedField === "password" && styles.inputFocused,
              ]}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              placeholderTextColor="#888"
            />

            {!!error && <Text style={styles.error}>{error}</Text>}

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>

            <View style={styles.divider} />

            <TouchableOpacity
              onPress={() =>
                router.push({
                  pathname: "/signup",
                  params: role ? { role } : undefined,
                })
              }
            >
              <Text style={styles.signupText}>
                Don’t have an account?{" "}
                <Text style={styles.signupLink}>Sign up now</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    backgroundColor: "rgba(255, 250, 243, 0.25)",
  },
  logoWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    marginTop: -24,
  },
  logo: {
    width: 480,
    height: 280,
    marginLeft: 15,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#3e403f",
    marginBottom: 36,
    textAlign: "center",
  },
  input: {
    backgroundColor: "#f4eadd",
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    color: "#3e403f",
    marginBottom: 16,
  },
  inputFocused: {
    backgroundColor: "#ede4d4",
    borderWidth: 1,
    borderColor: "#6a994e",
  },
  button: {
    backgroundColor: "#556B2F",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonText: {
    color: "#fffaf3",
    fontSize: 18,
    fontWeight: "bold",
  },
  error: {
    color: "#d9534f",
    marginBottom: 12,
    textAlign: "center",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 24,
  },
  signupText: {
    color: "#6c5c45",
    fontSize: 14,
    textAlign: "center",
  },
  signupLink: {
    color: "#556B2F",
    fontWeight: "700",
  },
});

