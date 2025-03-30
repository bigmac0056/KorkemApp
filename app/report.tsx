import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard, TouchableWithoutFeedback 
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";

const ReportScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");

  const handleSendReport = () => {
    if (message.trim().length === 0) {
      Alert.alert("Ошибка", "Введите сообщение перед отправкой.");
      return;
    }

    // Здесь можно добавить логику отправки на сервер или API
    console.log("Отправлено:", message);

    // Оповещение об отправке
    Alert.alert("Сообщение отправлено", "Ваше сообщение отправлено.");
    
    // Очистка поля после отправки
    setMessage("");
    Keyboard.dismiss(); // Закрываем клавиатуру после отправки
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Сообщить о происшествии</Text>

        {/* Поле ввода сообщения */}
        <TextInput
          style={styles.input}
          placeholder="Опишите происшествие..."
          placeholderTextColor="#666"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* Кнопка отправки */}
        <TouchableOpacity style={styles.sendButton} onPress={handleSendReport}>
          <MaterialIcons name="send" size={24} color="#FFF" />
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>

        {/* Кнопка Назад */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <MaterialIcons name="arrow-back" size={24} color="#FFF" />
          <Text style={styles.backButtonText}>Назад</Text>
        </TouchableOpacity>
      </View>
    </TouchableWithoutFeedback>
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
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 120,
    backgroundColor: "#FFF", 
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#B0B0B0", 
    marginBottom: 20,
    color: "#000", 
  },
  sendButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#28A745",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  sendButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
  },
  backButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
});

export default ReportScreen;