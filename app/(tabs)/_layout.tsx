import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="home" options={{ title: "Главная" }} />
      <Tabs.Screen name="emergency" options={{ title: "Экстренный вызов" }} />
      <Tabs.Screen name="report" options={{ title: "Сообщить о происшествии" }} />
      <Tabs.Screen name="chat" options={{ title: "Чат с оператором" }} />
      <Tabs.Screen name="news" options={{ title: "Новости" }} />
    </Tabs>
  );
}