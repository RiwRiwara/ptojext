import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div className={` bg-white px-4 py-6 h-screen ${className}`}>
      {children}
    </div>
  );
};

export default BaseLayout;
