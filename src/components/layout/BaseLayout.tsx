import React from "react";
import { AuthProvider } from "@/context/AuthContext";
import TopMenuSection from "@/components/common/TopMenuSection";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const BaseLayout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <AuthProvider>
      <div className={`max-h-screen mt-60 md:mt-24 ${className}`}>
        <TopMenuSection />
        <main className="flex-1 w-full mx-auto">
          {children}
        </main>
      </div>
    </AuthProvider>
  );
};

export default BaseLayout;
