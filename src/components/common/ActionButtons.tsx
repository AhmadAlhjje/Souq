"use client";

import React from "react";
import { Eye, Edit, Trash2, Plus, Download, Upload, Search, Filter, Truck, Check, X } from "lucide-react";
import useTheme from "@/hooks/useTheme";
import { useThemeContext } from "@/contexts/ThemeContext";


interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "success" | "danger" | "secondary" | "icon-only" | "confirm" | "cancel" | "ship";
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
  const { isDark } = useThemeContext();

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
        case "ship":
          return "text-teal-400 hover:bg-teal-900/20 focus:ring-teal-500 hover:shadow-lg hover:shadow-teal-500/20";
        case "icon-only":
          return "text-gray-300 hover:bg-gray-700 focus:ring-gray-500";
        case "confirm":
          return "text-emerald-400 hover:bg-emerald-900/30 focus:ring-emerald-500 bg-emerald-900/20 border border-emerald-800/50 shadow-emerald-900/25";
        case "cancel":
          return "text-rose-400 hover:bg-rose-900/30 focus:ring-rose-500 bg-rose-900/20 border border-rose-800/50 shadow-rose-900/25";
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
        case "ship":
          return "text-teal-600 hover:bg-teal-50 focus:ring-teal-500 hover:shadow-lg hover:shadow-teal-500/20";
        case "icon-only":
          return "text-gray-700 hover:bg-gray-200 focus:ring-gray-500";
        case "confirm":
          return "text-emerald-700 hover:bg-emerald-100 focus:ring-emerald-500 bg-emerald-50/80 border border-emerald-200 shadow-emerald-100/50 hover:shadow-emerald-200";
        case "cancel":
          return "text-rose-700 hover:bg-rose-100 focus:ring-rose-500 bg-rose-50/80 border border-rose-200 shadow-rose-100/50 hover:shadow-rose-200";
        default:
          return "text-gray-700 hover:bg-gray-200 focus:ring-gray-500";
      }
    }
  };

  const variantClass = getVariantClasses(variant);

  const baseClasses = `
    inline-flex items-center justify-center
    rounded-lg
    transition-all duration-300 ease-in-out
    focus:outline-none focus:ring-2 focus:ring-offset-2
    transform hover:scale-105 active:scale-95 active:duration-75
    shadow-sm hover:shadow-md
    ${variantClass}
    ${sizeClasses[size]}
    ${disabled || loading ? "opacity-50 cursor-not-allowed scale-100 hover:shadow-sm" : "cursor-pointer"}
    ${text ? "gap-2" : ""}
    ${variant === "confirm" || variant === "cancel" ? "font-medium" : ""}
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
      {/* Special effect for ship button */}
      {variant === "ship" && !disabled && !loading && (
        <div className="absolute inset-0 bg-gradient-to-r from-teal-400/0 via-teal-400/10 to-teal-400/0 animate-pulse"></div>
      )}
      
      {loading ? (
        <div
          className={`animate-spin rounded-full border-2 border-current border-t-transparent ${iconSizes[size]}`}
        />
      ) : (
        <>
          <span className={`${iconSizes[size]} ${variant === "ship" ? "relative z-10" : ""}`}>
            {icon}
          </span>
          {text && variant !== "icon-only" && (
            <span className={variant === "ship" ? "relative z-10" : ""}>
              {text}
            </span>
          )}
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

export function ShipButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Truck />}
      variant="ship"
      text={props.text}
      tooltip={props.tooltip ?? (props.text ? undefined : "تم الشحن / Ship")}
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

// أزرار الصح والغلط الجديدة
export function ConfirmButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Check />}
      variant="confirm"
      text={props.text}
      tooltip={props.tooltip ?? (props.text ? undefined : "تأكيد / Confirm")}
    />
  );
}

export function CancelButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<X />}
      variant="cancel"
      text={props.text}
      tooltip={props.tooltip ?? (props.text ? undefined : "إلغاء / Cancel")}
    />
  );
}

// أزرار للحفظ والرفض (أشكال بديلة)
export function SaveButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<Check />}
      variant="success"
      text={props.text ?? "حفظ"}
      tooltip={props.tooltip ?? "حفظ التغييرات / Save"}
    />
  );
}

export function RejectButton(props: Omit<BaseButtonProps, "icon" | "variant" | "text"> & { text?: string }) {
  return (
    <ActionButton
      {...props}
      icon={<X />}
      variant="danger"
      text={props.text ?? "رفض"}
      tooltip={props.tooltip ?? "رفض / Reject"}
    />
  );
}