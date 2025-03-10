import React from "react";

interface SectionTitleProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionTitle: React.FC<SectionTitleProps> = ({ children, className = "" }) => {
  return <h6 className={`text-lg font-bold text-gray-300 mb-2 ${className}`}>{children}</h6>;
};
