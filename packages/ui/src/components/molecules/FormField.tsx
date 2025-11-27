import { View } from 'react-native';
import { Typography } from '../atoms/Typography';
import { Input } from '../atoms/Input.web';
import { forwardRef } from 'react';

export interface FormFieldProps {
  label?: string;
  error?: string;
  required?: boolean;
  className?: string;
  inputProps?: React.ComponentProps<typeof Input>;
}

/**
 * Molécula FormField - Composición de Label + Input + ErrorMessage
 * Facilita la creación de formularios consistentes
 */
export const FormField = forwardRef<any, FormFieldProps>(
  ({ label, error, required, className = '', inputProps, ...props }, ref) => {
    return (
      <View className={`mb-4 ${className}`.trim()} {...props}>
        {label && (
          <Typography variant="body" className="mb-2 text-foreground">
            {label}
            {required && <Typography variant="body" className="text-destructive"> *</Typography>}
          </Typography>
        )}
        <Input
          ref={ref}
          className={error ? 'border-destructive' : ''}
          {...inputProps}
        />
        {error && (
          <Typography variant="caption" className="mt-1 text-destructive">
            {error}
          </Typography>
        )}
      </View>
    );
  }
);

FormField.displayName = 'FormField';

