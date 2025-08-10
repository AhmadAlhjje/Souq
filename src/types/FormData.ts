export interface SignUpFormData {
  fullName: string;
  email: string;
  phoneNumber: string;
  countryCode: string;
  password: string;
}

export interface SignInFormData {
  identifier: string;
  password: string;
}