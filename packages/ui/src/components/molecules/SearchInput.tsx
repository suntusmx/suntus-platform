import { View } from 'react-native';
import { Input } from '../atoms/Input.web';
import { Icon } from '../atoms/Icon';
import { forwardRef } from 'react';

export interface SearchInputProps {
  placeholder?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  className?: string;
}

/**
 * Molécula SearchInput - Input con ícono de lupa a la izquierda
 * Útil para barras de búsqueda
 */
export const SearchInput = forwardRef<any, SearchInputProps>(
  ({ placeholder = 'Buscar...', value, onChangeText, className = '' }, ref) => {
    return (
      <View className={`flex-row items-center rounded-md border border-border bg-background px-3 ${className}`.trim()}>
        <Icon name="Search" size={20} className="text-foreground/50 mr-2" />
        <Input
          ref={ref}
          placeholder={placeholder}
          value={value}
          onChangeText={onChangeText}
          className="flex-1 border-0 px-0 py-2"
        />
      </View>
    );
  }
);

SearchInput.displayName = 'SearchInput';

