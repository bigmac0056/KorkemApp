import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { View, Pressable, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from '../../hooks/useTranslation';
import { useLanguageContext } from '../../contexts/LanguageContext';
import { FontAwesome } from '@expo/vector-icons';

const iconNameMap: Record<string, keyof typeof Ionicons.glyphMap> = {
  learn: 'school',
  home: 'home',
  profile: 'person',
};

function AnimatedTabBarButton({ children, onPress, accessibilityState }: any) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const focused = accessibilityState?.selected;

  if (focused) {
    scale.value = withSpring(1.1, { damping: 5 });
  } else {
    scale.value = withSpring(1);
  }

  return (
    <Pressable onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
      <Animated.View style={[animatedStyle]}>{children}</Animated.View>
    </Pressable>
  );
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const t = useTranslation();

  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          height: Platform.OS === 'ios' ? 88 : 60,
          paddingBottom: Platform.OS === 'ios' ? 28 : 8,
          paddingTop: 8,
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
        tabBarActiveTintColor: '#007AFF',
        tabBarInactiveTintColor: '#8E8E93',
        headerShown: false,
        tabBarShowLabel: true,
      }}
    >
      <Tabs.Screen
        name="learn"
        options={{
          title: t.learn,
          tabBarIcon: ({ color }) => <FontAwesome name="book" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="home"
        options={{
          title: t.home,
          tabBarIcon: ({ color }) => <FontAwesome name="home" size={28} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t.profile,
          tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}