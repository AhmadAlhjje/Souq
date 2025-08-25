import React from 'react';
import { Settings, Download } from 'lucide-react';
import { ActionCard } from '../molecules';

interface ActionsGridProps {
  onAdvancedSettings: () => void;
  onExportData: () => void;
  themeClasses: {
    cardBackground: string;
    textPrimary: string;
    textMuted: string;
  };
}

const ActionsGrid: React.FC<ActionsGridProps> = ({
  onAdvancedSettings,
  onExportData,
  themeClasses
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-8">
      <ActionCard
        icon={Settings}
        title="الإعدادات المتقدمة"
        description="تحكم بالخيارات المتقدمة والإعدادات"
        buttonText="تحكم"
        onButtonClick={onAdvancedSettings}
        themeClasses={themeClasses}
      />

      <ActionCard
        icon={Download}
        title="تصدير البيانات"
        description="قم بتنزيل ملف البيانات وتاريخ المعاملات الخاص بك"
        buttonText="تحميل"
        onButtonClick={onExportData}
        themeClasses={themeClasses}
      />
    </div>
  );
};

export default ActionsGrid;
