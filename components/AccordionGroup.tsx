// components/AccordionGroup.tsx
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export function AccordionGroup({
  title,
  children,
  isOpen,
  onToggle,
}: {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <View style={styles.groupContainer}>
      <TouchableOpacity onPress={onToggle}>
        <Text style={styles.groupTitle}>
          {isOpen ? '▼' : '▶'} {title}
        </Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.groupContent}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 5,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
    paddingVertical: 6,
  },
  groupContent: {
    paddingLeft: 10,
    paddingTop: 4,
  },
});