import React from "react";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

const CommonLayout: React.FC<LayoutProps> = ({ children, className = "" }) => {
  return (
    <div
    style={{
        backgroundImage: `url("https://www.transparentpng.com/download/pattern/p3NBVZ-data-security-and-privacy-software-services-safe-data.png")`,
        backgroundSize: "cover", // Ensures the image covers the container
        backgroundPosition: "center", // Ensures the image is centered
        backgroundRepeat: "no-repeat", // Prevents the image from repeating
      }}
      className={` bg-gray-950 px-4 py-6 h-screen ${className}`}
    >
      {children}
    </div>
  );
};

export default CommonLayout;
