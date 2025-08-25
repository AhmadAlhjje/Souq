import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Input, EditButton, ConfirmButton, CancelButton } from '../atoms';

interface ProfileFieldProps {
  label: string;
  description: string;
  value: string;
  icon: LucideIcon;
  isEditing: boolean;
  tempValue: string;
  onEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  themeClasses: {
    cardBackground: string;
    iconBackground: string;
    textPrimary: string;
    textMuted: string;
    textSecondary: string;
  };
}

const ProfileField: React.FC<ProfileFieldProps> = ({
  label,
  description,
  value,
  icon: Icon,
  isEditing,
  tempValue,
  onEdit,
  onSave,
  onCancel,
  onChange,
  placeholder,
  themeClasses
}) => {
  return (
    <div className={`${themeClasses.cardBackground} rounded-2xl shadow-lg p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center justify-end gap-3 flex-1">
          <div className={`${themeClasses.iconBackground} p-2 rounded-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h3 className={`font-medium ${themeClasses.textPrimary}`}>
              {label}
            </h3>
            <p className={`text-sm ${themeClasses.textMuted}`}>
              {description}
            </p>
            {isEditing ? (
              <div className="mt-2 flex gap-2 items-center">
                <Input
                  value={tempValue}
                  onChange={(e) => onChange(e.target.value)}
                  placeholder={placeholder}
                />
                <ConfirmButton
                  onClick={onSave}
                  size="sm"
                  tooltip="حفظ التغييرات"
                />
                <CancelButton
                  onClick={onCancel}
                  size="sm"
                  tooltip="إلغاء التعديل"
                />
              </div>
            ) : (
              <p className={`text-sm font-medium ${themeClasses.textSecondary} mt-1`}>
                {value}
              </p>
            )}
          </div>
        </div>

        {!isEditing && (
          <div className="mr-3">
            <EditButton
              onClick={onEdit}
              size="md"
              tooltip={`تعديل ${label}`}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileField;