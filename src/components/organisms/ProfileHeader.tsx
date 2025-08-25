import React from 'react';
import { ImageUpload } from '../molecules';
import { Avatar, Heading, Badge } from '../atoms';

interface ProfileHeaderProps {
  storeName: string;
  logo?: string | null;
  coverImage?: string | null;
  onLogoUpload: (file: File) => void;
  onCoverUpload: (file: File) => void;
  themeClasses: {
    cardBackground: string;
    textPrimary: string;
    textMuted: string;
    borderColor: string;
    shadow: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  storeName,
  logo,
  coverImage,
  onLogoUpload,
  onCoverUpload,
  themeClasses
}) => {
  return (
    <div className="relative">
      {/* Cover Image */}
      <ImageUpload
        type="cover"
        currentImage={coverImage}
        onImageUpload={onCoverUpload}
      />

      {/* Profile Card */}
      <div className="-mt-4 flex justify-center">
        <div className="w-full max-w-2xl">
          <div className={`${themeClasses.cardBackground} rounded-2xl ${themeClasses.shadow} p-6`}>
            <div className="flex justify-start items-center mb-4">
              <div className="flex items-center gap-4">
                {/* Store Logo */}
                <ImageUpload
                  type="avatar"
                  currentImage={logo}
                  onImageUpload={onLogoUpload}
                  size="lg"
                />

                <div className="text-right">
                  <Heading
                    text={storeName}
                    level={2}
                    className={`text-xl font-bold ${themeClasses.textPrimary}`}
                  />
                  <p className={themeClasses.textMuted}>حساب تاجر متقدم</p>
                </div>
              </div>
            </div>

            {/* Status Badges */}
            <div className="flex justify-end gap-2 mb-4">
              <Badge variant="new" text="تاريخ الانضمام 2023" />
              <Badge variant="primary" text="بودرونت نيوتن" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;