import React from "react";
import TopMenuSection from "@/components/common/TopMenuSection";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={` bg-white max-h-screen mt-24 ${className}`}>
      <TopMenuSection />
      {children}
    </div>
  );
};

export default BaseLayout;
