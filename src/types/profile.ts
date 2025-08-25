export interface ProfileData {
  name: string;
  storeName: string;
  password: string;
  phone: string;
  logo: string | null;
  coverImage: string | null;
}

export interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  step: 'verify' | 'new';
}

export interface ProfileStats {
  orders: number;
  rating: number;
  activity: number;
}