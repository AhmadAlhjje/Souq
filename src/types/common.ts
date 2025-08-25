export type EditingField = "name" | "storeName" | "password" | "phone" | "logo" | "coverImage";

export interface EditingState {
  name: boolean;
  storeName: boolean;
  password: boolean;
  phone: boolean;
  logo: boolean;
  coverImage: boolean;
}

export interface ThemeClasses {
  background: string;
  navBackground: string;
  cardBackground: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;
  borderColor: string;
  iconBackground: string;
  buttonBackground: string;
  buttonIcon: string;
  shadow: string;
  inputBackground: string;
  inputBorder: string;
  inputText: string;
}