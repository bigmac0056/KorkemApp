import { DarkTheme, DefaultTheme, ThemeProvider } from "@react-navigation/native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { useFonts } from "expo-font";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useColorScheme } from "./components/useColorScheme";
import { Platform } from "react-native";
import TabLayout from "./app/(tabs)/_layout"; 
import "react-native-gesture-handler";
import { initDatabase, getPhraseCount } from "./database/database";

SplashScreen.preventAutoHideAsync();

const Stack = createStackNavigator();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("./assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      initDatabase((error: Error | null) => {
        if (error) {
          console.error('Database initialization failed:', error);
          return;
        }
        getPhraseCount((error: Error | null, count: number) => {
          if (error) {
            console.error('Failed to get phrase count:', error);
            return;
          }
          console.log(`Total phrases: ${count}`);
        });
        console.log('Database initialized successfully');
        SplashScreen.hideAsync();
      });
    }
  }, [loaded]);

  if (!loaded) return null;

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: Platform.OS === "ios",
          ...TransitionPresets.SlideFromRightIOS,
        }}
      >
        <Stack.Screen name="(tabs)" component={TabLayout} />
      </Stack.Navigator>
    </ThemeProvider>
  );
}