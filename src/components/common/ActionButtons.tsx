"use client";

import React from "react";
import { Eye, Edit, Trash2, Plus, Download, Upload, Search, Filter } from "lucide-react";
import useTheme from "@/hooks/useTheme";

interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "danger" | "secondary" | "icon-only";
  tooltip?: string;
  text?: string;
  icon: React.ReactNode;
}

const sizeClasses = {
  sm: "p-1 text-xs",
  md: "p-2 text-base",
  lg: "p-3 text-lg",
};

const iconSizes = {
  sm: "w-4 h-4",
  md: "w-5 h-5",
  lg: "w-6 h-6",
};

export function ActionButton({
  loading = false,
  size = "md",
  variant = "primary",
  tooltip,
  text,
  icon,
  disabled,
  onClick,
  ...props
}: BaseButtonProps) {
  const { isDark } = useTheme();

  // Dynamic variant classes based on theme
  const getVariantClasses = (variant: string) => {
    if (isDark) {
      switch (variant) {
        case "primary":
          return "text-blue-400 hover:bg-blue-900/20 focus:ring-blue-500";
        case "success":
          return "text-green-400 hover:bg-green-900/20 focus:ring-green-500";
        case "danger":
          return "text-red-400 hover:bg-red-900/20 focus:ring-red-500";
        case "secondary":
          return "text-gray-400 hover:bg-gray-800 focus:ring-gray-500";
        case "icon-only":
          return "text-gray-300 hover:bg-gray-700 focus:ring-gray-500";
        default:
          return "text-gray-300 hover:bg-gray-700 focus:ring-gray-500";
      }
    } else {
      switch (variant) {
        case "primary":
          return "text-[#004D5A] hover:bg-[#CFF7EE] focus:ring-[#5CA9B5]";
        case "success":
          return "text-[#5CA9B5] hover:bg-[#CFF7EE] focus:ring-[#5CA9B5]";
        case "danger":
          return "text-red-500 hover:bg-red-50 focus:ring-red-500";
        case "secondary":
          return "text-gray-600 hover:bg-gray-100 focus:ring-gray-500";
        case "icon-only":
          return "text-gray-700 hover:bg-gray-200 focus:ring-gray-500";
        default:
          return "text-gray-700 hover:bg-gray-200 focus:ring-gray-500";
      }
    }
  };

  const variantClass = getVariantClasses(variant);

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-md
    transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform hover:scale-105 active:scale-95
    ${variantClass}
    ${sizeClasses[size]}
    ${disabled || loading ? "opacity-50 cursor-not-allowed scale-100" : "cursor-pointer"}
    ${text ? "gap-2" : ""}
  `;

  return (
    <button
      type="button"
      onClick={disabled || loading ? undefined : onClick}
      disabled={disabled || loading}
      className={baseClasses}
      title={tooltip || text}
      aria-label={tooltip || text}
      {...props}
    >
      {loading ? (
        <div
          className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`}
        />
      ) : (
        <>
          <span className={iconSizes[size]}>{icon}</span>
          {text && variant !== "icon-only" && <span>{text}</span>}
        </>
      )}
    </button>
  );
}

// أزرار الإجراءات المحسنة مع Dark Mode

export function ViewButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Eye />}
      variant="primary"
      text={props.text}
      tooltip={props.tooltip ?? (props.text ? undefined : "عرض / View")}
    />
  );
}

export function EditButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Edit />}
      variant="success"
      text={props.text}
      tooltip={props.tooltip ?? (props.text ? undefined : "تعديل / Edit")}
    />
  );
}

export function DeleteButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { loading?: boolean; text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Trash2 />}
      variant="danger"
      text={props.text}
      tooltip={props.tooltip ?? (props.text ? undefined : "حذف / Delete")}
      loading={props.loading}
    />
  );
}

export function AddButton(props: Omit<BaseButtonProps, "icon" | "variant"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Plus />}
      variant="primary"
      tooltip={props.tooltip ?? (props.text ? undefined : "إضافة / Add")}
    />
  );
}

export function DownloadButton(props: Omit<BaseButtonProps, "icon" | "variant"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Download />}
      variant="secondary"
      tooltip={props.tooltip ?? (props.text ? undefined : "تحميل / Download")}
    />
  );
}

export function UploadButton(props: Omit<BaseButtonProps, "icon" | "variant"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Upload />}
      variant="secondary"
      tooltip={props.tooltip ?? (props.text ? undefined : "رفع / Upload")}
    />
  );
}

export function SearchButton(props: Omit<BaseButtonProps, "icon" | "variant"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Search />}
      variant="secondary"
      tooltip={props.tooltip ?? (props.text ? undefined : "بحث / Search")}
    />
  );
}

export function FilterButton(props: Omit<BaseButtonProps, "icon" | "variant"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Filter />}
      variant="secondary"
      tooltip={props.tooltip ?? (props.text ? undefined : "تصفية / Filter")}
    />
  );
}