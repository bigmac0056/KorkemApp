// components/AccordionGroup.tsx
import React from 'react';
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
      <TouchableOpacity onPress={onToggle} style={styles.header}>
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
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    padding: 12,
    backgroundColor: '#f5f5f5',
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  groupContent: {
    padding: 10,
  },
});