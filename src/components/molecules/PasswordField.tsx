import React from 'react';
import { Shield, Eye } from 'lucide-react';
import { PasswordInput, EditButton, ConfirmButton, CancelButton, Button } from '../atoms';

interface PasswordState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
  showOldPassword: boolean;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  step: 'verify' | 'new';
}

interface ProfilePasswordFieldProps {
  isEditing: boolean;
  passwordState: PasswordState;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onPasswordStateChange: (state: Partial<PasswordState>) => void;
  onVerifyOldPassword: () => void;
  themeClasses: {
    cardBackground: string;
    iconBackground: string;
    textPrimary: string;
    textMuted: string;
    textSecondary: string;
  };
}

const ProfilePasswordField: React.FC<ProfilePasswordFieldProps> = ({
  isEditing,
  passwordState,
  onEdit,
  onSave,
  onCancel,
  onPasswordStateChange,
  onVerifyOldPassword,
  themeClasses
}) => {
  return (
    <div className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end gap-3 flex-1">
          <div className={`${themeClasses.iconBackground} p-2 rounded-lg`}>
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-medium ${themeClasses.textPrimary}`}>
              كلمة المرور
            </h3>
            <p className={`text-sm ${themeClasses.textMuted}`}>
              تحديث كلمة المرور
            </p>
            {isEditing ? (
              <div className="mt-2 space-y-3">
                {passwordState.step === 'verify' ? (
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1">
                      <PasswordInput
                        value={passwordState.oldPassword}
                        onChange={(e) => onPasswordStateChange({ oldPassword: e.target.value })}
                        placeholder="أدخل كلمة المرور القديمة"
                      />
                    </div>
                    <Button
                      onClick={onVerifyOldPassword}
                      variant="secondary"
                      size="sm"
                      text="تحقق"
                    />
                    <CancelButton
                      onClick={onCancel}
                      size="sm"
                      tooltip="إلغاء التعديل"
                    />
                  </div>
                ) : (
                  <div className="space-y-2">
                    <PasswordInput
                      value={passwordState.newPassword}
                      onChange={(e) => onPasswordStateChange({ newPassword: e.target.value })}
                      placeholder="كلمة المرور الجديدة"
                    />
                    <PasswordInput
                      value={passwordState.confirmPassword}
                      onChange={(e) => onPasswordStateChange({ confirmPassword: e.target.value })}
                      placeholder="تأكيد كلمة المرور الجديدة"
                    />
                    <div className="flex gap-2">
                      <ConfirmButton
                        onClick={onSave}
                        text="حفظ"
                        size="sm"
                        tooltip="حفظ كلمة المرور الجديدة"
                      />
                      <CancelButton
                        onClick={onCancel}
                        text="إلغاء"
                        size="sm"
                        tooltip="إلغاء التعديل"
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className={`text-sm font-medium ${themeClasses.textSecondary} mt-1 flex items-center justify-end gap-2`}>
                <Eye className="w-4 h-4" />
                ••••••••
              </p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="mr-3">
            <EditButton
              onClick={onEdit}
              size="md"
              tooltip="تعديل كلمة المرور"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePasswordField;