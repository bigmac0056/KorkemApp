import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { Tabs } from "expo-router";
import { Platform } from "react-native";

const Stack = createStackNavigator();

export default function TabLayout() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: Platform.OS === "ios", 
        ...TransitionPresets.SlideFromRightIOS,
      }}
    >
      <Stack.Screen name="tabs" component={TabsLayout} />
    </Stack.Navigator>
  );
}

function TabsLayout() {
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