// Shared TypeScript interfaces and types
import { LucideIcon } from 'lucide-react';

export interface InputProps {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  className?: string;
  disabled?: boolean;
  required?: boolean;
  theme?: 'light' | 'dark';
}

export interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  theme?: 'light' | 'dark';
}

export interface LabelProps {
  children: React.ReactNode;
  className?: string;
  htmlFor?: string;
}

export interface FormFieldProps {
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  icon?: LucideIcon;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  theme?: 'light' | 'dark';
  error?: string;
  helperText?: string;
}

export interface FileUploadProps {
  label: string;
  icon: React.ReactNode;
  accept?: string;
  onChange: (file: File | null) => void;
  theme?: 'light' | 'dark';
  disabled?: boolean;
  error?: string;
  helperText?: string;
}

export interface ShippingFormData {
  title: string;
  fullName: string;
  phoneNumber: string;
  address: string;
  identityFile: File | null;
  addressFile: File | null;
}

export interface FormErrors {
  title?: string;
  fullName?: string;
  phoneNumber?: string;
  address?: string;
  identityFile?: string;
  addressFile?: string;
}

// Theme types
export type ColorTheme = 'light' | 'dark';
export type ColorVariant = 'primary' | 'secondary' | 'success' | 'info' | 'warning';

// API types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface ShippingApiResponse extends ApiResponse<{
  orderId: string;
  trackingNumber?: string;
}> {}

// Validation types
export type ValidationRule = {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | undefined;
};

export type ValidationRules = {
  [K in keyof ShippingFormData]?: ValidationRule;
};