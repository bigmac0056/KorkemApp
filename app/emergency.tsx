import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert, Vibration } from "react-native";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const EmergencyScreen = () => {
  const navigation = useNavigation();
  const [countdown, setCountdown] = useState<number | null>(null);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);

  const handleEmergencyCall = () => {
    Alert.alert("🚨 Экстренный вызов", "Вы уверены, что хотите совершить экстренный вызов?", [
      { text: "Отмена", style: "cancel" },
      { text: "Позвонить", onPress: () => console.log("Вызов отправлен") },
    ]);
  };

  const handleSOSStart = () => {
    setCountdown(3);
    let timeLeft = 3;
    
    const timer = setInterval(() => {
      timeLeft -= 1;
      setCountdown(timeLeft);

      Vibration.vibrate(500); // Вибрация на 0.5 сек

      if (timeLeft <= 0) {
        clearInterval(timer);
        handleEmergencyCall();
      }
    }, 1000);

    setLongPressTimer(timer);
  };

  const handleSOSEnd = () => {
    if (longPressTimer) {
      clearInterval(longPressTimer);
      setLongPressTimer(null);
      setCountdown(null);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

      <Text style={styles.header}>Экстренный вызов</Text>

      <View style={styles.sosContainer}>
        <TouchableOpacity
          style={styles.sosButton}
          onPressIn={handleSOSStart}
          onPressOut={handleSOSEnd}
        >
          <Text style={styles.sosText}>SOS</Text>
        </TouchableOpacity>
        <Text style={[styles.holdText, countdown !== null && { color: "red" }]}>
          {countdown !== null ? `Осталось: ${countdown} сек` : "Удерживайте 3 секунды для вызова SOS"}
        </Text>
      </View>

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
    top: 54,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
  },
  sosContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  sosButton: {
    width: 150,
    height: 150,
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 100,
  },
  sosText: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "bold",
  },
  holdText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
    color: "#666",
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