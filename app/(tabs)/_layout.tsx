import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';
import { Pressable } from 'react-native';

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
  return (
    <Tabs
      screenOptions={({ route }) => {
        const iconName = iconNameMap[route.name] ?? 'ellipse';

        return {
          tabBarIcon: ({ color, size }) => (
            <Ionicons name={iconName} size={25} color={color} />
          ),
          tabBarButton: (props) => <AnimatedTabBarButton {...props} />,
          tabBarActiveTintColor: '#1976D2',
          tabBarInactiveTintColor: '#666',

          tabBarStyle: {
            position: 'absolute',
            left: 20,
            right: 20,
            height: 65,
            paddingBottom: 10,
            paddingTop: 10,
            
            backgroundColor: '#fff',
            borderRadius: 20,
            borderTopWidth: 0,
            elevation: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 8,
          },

          headerShown: false,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '600',
          },
        };
      }}
    >
      <Tabs.Screen name="learn" />
      <Tabs.Screen name="home" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
} 