import { User } from "lucide-react";
import InputField from "../../components/molecules/InputField";
import PasswordField from "../../components/molecules/PasswordField";
import PhoneField from "../../components/molecules/PhoneField";
import ActionButtons from "../../components/molecules/ActionButtons";
import AuthActionButtons from "../molecules/AuthActionButtons";

const LoginForm = ({ formData, handleInputChange, onSubmit }) => {
  return (
    <div className="space-y-2 sm:space-y-4">
      <InputField
        label="الإسم الكريم"
        type="text"
        placeholder="أدخل الإسم الكريم"
        value={formData.fullName}
        onChange={(e) => handleInputChange("fullName", e.target.value)}
        icon={User}
      />

      <InputField
        label="البريد الإلكتروني"
        type="email"
        placeholder="أدخل البريد الإلكتروني"
        value={formData.email}
        onChange={(e) => handleInputChange("email", e.target.value)}
      />

      <PhoneField
        label="رقم الجوال"
        countryCode={formData.countryCode}
        setCountryCode={(value) => handleInputChange("countryCode", value)}
        phoneNumber={formData.phoneNumber}
        setPhoneNumber={(value) => handleInputChange("phoneNumber", value)}
      />

      <PasswordField
        label="كلمة المرور"
        value={formData.password}
        onChange={(e) => handleInputChange("password", e.target.value)}
      />

      <AuthActionButtons
        onLogin={onSubmit}
        onCreateAccount={() => console.log("إنشاء حساب جديد")}
      />
    </div>
  );
};

export default LoginForm;
