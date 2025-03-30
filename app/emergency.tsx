import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EmergencyScreen = () => {
  const navigation = useNavigation();

  const handleEmergencyCall = () => {
    Alert.alert("🚨 Экстренный вызов", "Вы уверены, что хотите совершить экстренный вызов?", [
      { text: "Отмена", style: "cancel" },
      { text: "Позвонить", onPress: () => console.log("Вызов отправлен") },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Кнопка Назад */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      {/* Заголовок */}
      <Text style={styles.header}>Экстренный вызов</Text>

      {/* Кнопка вызова */}
      <TouchableOpacity style={styles.callButton} onPress={handleEmergencyCall}>
        <Ionicons name="call" size={30} color="#fff" />
        <Text style={styles.buttonText}>Позвонить 112</Text>
      </TouchableOpacity>

      {/* Дополнительная информация */}
      <Text style={styles.infoText}>
        В случае опасности не паникуйте. Сообщите оператору точное местоположение и причину вызова.
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 20,
    paddingTop: 50,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backText: {
    fontSize: 18,
    marginLeft: 5,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  callButton: {
    backgroundColor: "#E53935",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
    width: "100%",
  },
  buttonText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
  infoText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginTop: 20,
    paddingHorizontal: 10,
  },
});

export default EmergencyScreen;