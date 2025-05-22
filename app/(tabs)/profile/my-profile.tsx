// app/profile/my-profile.tsx
import { View, Text, StyleSheet, Image } from 'react-native';

export default function MyProfileScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>👤 Мой профиль</Text>

      <Image
        source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
        style={styles.avatar}
      />

      <Text style={styles.name}>Имя пользователя</Text>
      <Text style={styles.info}>Email: user@example.com</Text>
      <Text style={styles.info}>Изучаемый язык: Казахский 🇰🇿</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
});