import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder = 'Buscar eventos...' }: SearchBarProps) => {
  const borderColor = useThemeColor({ light: '#CCCCCC', dark: '#555555' }, 'text');
  const textColor = useThemeColor({ light: '#000000', dark: '#FFFFFF' }, 'text');
  const iconColor = useThemeColor({ light: '#666666', dark: '#999999' }, 'text');

  return (
    <View style={[styles.searchContainer, { borderColor }]}>
      <Ionicons name="search" size={18} color={iconColor} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder={placeholder}
        placeholderTextColor={iconColor}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1.5,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    borderRadius: 30,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
});

export default SearchBar;
