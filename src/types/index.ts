// types/index.ts
export interface IconProps {
  name: 
    | 'search'
    | 'facebook'
    | 'twitter'
    | 'linkedin'
    | 'instagram'
    | 'heart'
    | 'share'
    | 'cart'
    | 'star'
    | 'location'
    | 'clock'
    | 'users'
    | 'shield'
    | 'credit-card'
    | 'truck'
    | 'headphones'
    | 'chevron-right'
    | 'percent'
    | 'envelope'
    | 'phone';
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
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
}

export interface TypographyProps {
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption';
  className?: string;
}

export interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
}

export interface StatCardProps {
  value: string;
  label: string;
  className?: string;
}

export interface IconWrapperProps {
  icon: React.ReactNode;
  gradient?: string;
  size?: 'small' | 'medium' | 'large';
}

export interface SolutionFeature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export interface Solution {
  id: number;
  title: string;
  description: string;
  image: string;
  buttonIcon: React.ReactNode;
  buttonText: string;
  features: SolutionFeature[];
  background: string;
  reverse: boolean;
}

export interface SolutionCardProps {
  solution: Solution;
}

export interface AboutPageTemplateProps {
  solutions: Solution[];
}
export * from './common';
export * from './profile';

