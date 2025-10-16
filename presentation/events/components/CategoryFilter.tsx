import { ThemedText } from '@/presentation/theme/components/ThemedText';
import { ThemedView } from '@/presentation/theme/components/ThemedView';
import { useThemeColor } from '@/presentation/theme/hooks/use-theme-color';
import React from 'react';
import { ScrollView, TouchableOpacity } from 'react-native';

interface Category {
  id: string;
  name: string;
  color?: 'orange' | 'purple' | 'gray';
}

interface Props {
  categories: Category[];
  selectedCategory?: string;
  onCategoryPress: (categoryId: string) => void;
}

const CategoryFilter = ({ categories, selectedCategory, onCategoryPress }: Props) => {
  const unselectedTextColor = useThemeColor({ light: '#FF8C00', dark: '#FFB347' }, 'text');
  const unselectedBorderColor = useThemeColor({ light: '#FF8C00', dark: '#FFB347' }, 'text');

  const getButtonColors = (category: Category, isSelected: boolean) => {
    if (isSelected) {
      switch (category.color) {
        case 'purple':
          return {
            backgroundColor: '#9C27B0',
            textColor: '#FFFFFF',
          };
        case 'orange':
          return {
            backgroundColor: '#FF8C00',
            textColor: '#FFFFFF',
          };
        default:
          return {
            backgroundColor: '#FF8C00',
            textColor: '#FFFFFF',
          };
      }
    } else {
      // Estado no seleccionado
      return {
        backgroundColor: 'transparent',
        textColor: unselectedTextColor,
        borderColor: unselectedBorderColor,
      };
    }
  };

  return (
    <ThemedView 
      style={{ paddingTop: 0, paddingBottom: 0, backgroundColor: '#1A1A1A' }}
      lightColor="#2A2A2A"
      darkColor="#1A1A1A"
    >
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20 }}
      >
        {categories.map((category, index) => {
          const isSelected = selectedCategory === category.id;
          const colors = getButtonColors(category, isSelected);
          
          return (
            <TouchableOpacity
              key={category.id}
              onPress={() => onCategoryPress(category.id)}
              style={{
                backgroundColor: colors.backgroundColor,
                borderWidth: isSelected ? 0 : 1.5,
                borderColor: colors.borderColor,
                borderRadius: 25,
                paddingHorizontal: 20,
                paddingVertical: 10,
                marginRight: index < categories.length - 1 ? 12 : 0,
                minWidth: 80,
              }}
            >
              <ThemedText
                style={{
                  textAlign: 'center',
                  fontWeight: '600',
                  fontSize: 14,
                  color: colors.textColor,
                }}
              >
                {category.name}
              </ThemedText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
};

export default CategoryFilter;