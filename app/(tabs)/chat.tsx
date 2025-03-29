import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const ChatScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Чат с оператором</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#FFF" />
        <Text style={styles.buttonText}>Назад</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
  },
});

export default ChatScreen;