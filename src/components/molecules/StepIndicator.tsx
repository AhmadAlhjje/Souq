// src/components/molecules/StepIndicator.tsx
import React from 'react';
import { FileText, Image, ArrowRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  className?: string;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  className = ''
}) => {
  const steps = [
    { id: 1, title: 'المعلومات الأساسية', icon: FileText },
    { id: 2, title: 'الصور', icon: Image }
  ];

  return (
    <div className={`flex items-center justify-center mb-8 ${className}`}>
      <div className="flex items-center gap-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              currentStep === step.id 
                ? 'bg-teal-500 text-white shadow-lg' 
                : 'bg-white/80 dark:bg-slate-800/80 text-gray-600 dark:text-gray-300'
            }`}>
              <step.icon className="w-4 h-4" />
              <span className="font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <ArrowRight className="w-4 h-4 text-gray-400" />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;