import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, Keyboard, 
  TouchableWithoutFeedback, Image 
} from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const ReportScreen = () => {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [media, setMedia] = useState<{ uri: string, type: string } | null>(null);

  const handleSendReport = () => {
    if (message.trim().length === 0) {
      Alert.alert("Ошибка", "Введите сообщение перед отправкой.");
      return;
    }

    console.log("Отправлено:", message, media);

    Alert.alert("Сообщение отправлено", "Ваше сообщение отправлено.");
    
    // Очистка после отправки
    setMessage("");
    setMedia(null);
    Keyboard.dismiss();
  };

  const pickMedia = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("Ошибка", "Разрешите доступ к галерее для прикрепления файлов.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 1,
    });

    if (!result.canceled) {
      const fileSize = result.assets[0].fileSize ?? 0;
      if (fileSize > 10 * 1024 * 1024) {  
        Alert.alert("Ошибка", "Файл слишком большой. Максимальный размер — 10 МБ.");
        return;
      }
      setMedia({ uri: result.assets[0].uri, type: result.assets[0].type ?? "Ошибка" });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.header}>Сообщить о происшествии</Text>

        <TextInput
          style={styles.input}
          placeholder="Опишите происшествие..."
          placeholderTextColor="#666"
          multiline
          value={message}
          onChangeText={setMessage}
        />

        {/* Кнопка прикрепления фото/видео */}
        <TouchableOpacity style={styles.attachButton} onPress={pickMedia}>
          <MaterialIcons name="attach-file" size={24} color="#FFF" />
          <Text style={styles.attachButtonText}>Прикрепить фото/видео</Text>
        </TouchableOpacity>

        {/* Отображение прикрепленного файла */}
        {media && (
          <View style={styles.previewContainer}>
            {media.type.includes("image") ? (
              <Image source={{ uri: media.uri }} style={styles.previewImage} />
            ) : (
              <Text style={styles.previewText}>Прикреплено видео</Text>
            )}
          </View>
        )}

        <TouchableOpacity style={styles.sendButton} onPress={handleSendReport}>
          <MaterialIcons name="send" size={24} color="#FFF" />
          <Text style={styles.sendButtonText}>Отправить</Text>
        </TouchableOpacity>

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
  attachButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    padding: 12,
    borderRadius: 8,
    width: "100%",
    justifyContent: "center",
    marginBottom: 10,
  },
  attachButtonText: {
    color: "#FFF",
    fontSize: 16,
    marginLeft: 8,
    fontWeight: "bold",
  },
  previewContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginTop: 5,
  },
  previewText: {
    color: "#333",
    fontSize: 16,
    marginTop: 5,
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