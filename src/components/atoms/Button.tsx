"use client";
import React from "react";

// تعريف الألوان الأساسية
const COLORS = {
  light: {
    primary: "#004D5A",
    secondary: "#96EDD9",
    success: "#10B981",
    info: "#3B82F6",
    warning: "#F59E0B",
    text: {
      primary: "#004D5A",
      inverse: "#FFFFFF",
    },
    border: {
      light: "#E5E7EB",
    },
  },
};

interface ButtonProps {
  text?: string;
  children?: React.ReactNode;
  onClick?: () => void;
  className?: string;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
  type?: "button" | "submit" | "reset";
  variant?:
    | "primary"
    | "secondary"
    | "danger"
    | "success"
    | "ghost"
    | "outline"
    | "teal"
    | "teal-outline"
    | "info"
    | "warning";
  size?: "sm" | "md" | "lg";
}

const Button: React.FC<ButtonProps> = ({
  text,
  children,
  onClick,
  className = "",
  startIcon,
  endIcon,
  disabled = false,
  loading = false,
  type = "button",
  variant = "primary",
  size = "md",
}) => {
  const colors = COLORS.light;

  // Base classes
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 transform hover:scale-105 active:scale-95";
  // Variant classes
  const variantClasses = {
    primary: "bg-[#004D5A] text-white hover:bg-[#003a44] focus:ring-[#5CA9B5]",
    secondary:
      "bg-[#5CA9B5] text-white hover:bg-[#4a8b94] focus:ring-[#5CA9B5]",
    danger: "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500",
    success: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-500",
    ghost: "bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-500",
    outline:
      "bg-transparent border-2 border-[#004D5A] text-[#004D5A] hover:bg-[#004D5A] hover:text-white focus:ring-[#5CA9B5]",
    teal: "bg-teal-500 text-white hover:bg-teal-600 focus:ring-teal-500",
    "teal-outline":
      "bg-white border-2 border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white focus:ring-teal-500",
  };

  // Size classes
  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs sm:text-sm",
    md: "px-4 py-2 text-sm sm:text-base",
    lg: "px-6 py-3 text-base sm:text-lg",
  };

  // Icon size based on button size
  const iconSize = {
    sm: "14px",
    md: "16px",
    lg: "18px",
  };

  // Loading spinner component
  const LoadingSpinner = () => (
    <div
      className="animate-spin rounded-full border-2 border-current border-t-transparent"
      style={{
        width: iconSize[size],
        height: iconSize[size],
      }}
    />
  );

  // Get variant styles
  const getVariantStyles = () => {
    const baseStyle = {
      transition: "all 0.3s ease",
    };

    switch (variant) {
      case "primary":
        return {
          ...baseStyle,
          backgroundColor: colors.primary,
          color: colors.text.inverse,
          boxShadow: `0 4px 15px ${colors.primary}30`,
        };
      case "secondary":
        return {
          ...baseStyle,
          backgroundColor: colors.secondary,
          color: colors.text.primary,
          border: `1px solid ${colors.border.light}`,
        };
      case "success":
        return {
          ...baseStyle,
          backgroundColor: colors.success,
          color: colors.text.inverse,
        };
      case "info":
        return {
          ...baseStyle,
          backgroundColor: colors.info,
          color: colors.text.inverse,
        };
      case "danger":
        return {
          ...baseStyle,
          backgroundColor: "#EF4444",
          color: colors.text.inverse,
        };
      case "warning":
        return {
          ...baseStyle,
          backgroundColor: colors.warning,
          color: colors.text.inverse,
        };
      case "outline":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: colors.primary,
          border: `2px solid ${colors.primary}`,
        };
      case "ghost":
        return {
          ...baseStyle,
          backgroundColor: "transparent",
          color: colors.text.primary,
        };
      default:
        return baseStyle;
    }
  };

  // Determine if button should be disabled
  const isDisabled = disabled || loading;

  // Build final className
  const finalClassName = `
    ${baseClasses}
    ${sizeClasses[size]}
    ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `.trim();

  // Determine content - either text or children
  const content = children || text;

  // Enhanced hover effects
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && variant === "primary") {
      e.currentTarget.style.transform = "scale(1.05) translateY(-2px)";
      e.currentTarget.style.boxShadow = `0 6px 20px ${colors.primary}40`;
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isDisabled && variant === "primary") {
      e.currentTarget.style.transform = "scale(1)";
      e.currentTarget.style.boxShadow = `0 4px 15px ${colors.primary}30`;
    }
  };

  return (
    <button
      onClick={isDisabled ? undefined : onClick}
      className={finalClassName}
      style={getVariantStyles()}
      type={type}
      disabled={isDisabled}
      aria-disabled={isDisabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Loading state */}
      {loading ? (
        <LoadingSpinner />
      ) : (
        startIcon && <span className="flex-shrink-0 mr-1.5">{startIcon}</span>
      )}

      {/* Button content */}
      {typeof content === "string" ? (
        <span className="whitespace-nowrap">{content}</span>
      ) : (
        content
      )}

      {/* End icon (only if not loading) */}
      {!loading && endIcon && (
        <span className="flex-shrink-0 ml-1.5">{endIcon}</span>
      )}
    </button>
  );
};

export default Button;
