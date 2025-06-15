// components/AccordionGroup.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

interface AccordionGroupProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <View style={styles.groupContainer}>
      <TouchableOpacity onPress={onToggle} style={styles.header}>
        <Text style={styles.groupTitle}>
          {isOpen ? '▼' : '▶'} {title}
        </Text>
      </TouchableOpacity>
      {isOpen && <View style={styles.content}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    marginBottom: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 5,
  },
  groupTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  content: {
    marginTop: 5,
  },
});