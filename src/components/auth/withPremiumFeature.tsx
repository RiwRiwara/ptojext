"use client";
import React, { useState, ComponentType, ReactElement } from "react";
import { PremiumFeatureModal } from "./PremiumFeatureModal";
import { useAuth } from "@/context/AuthContext";
import { FaLock } from "react-icons/fa";

interface WithPremiumFeatureProps {
  featureName: string;
  description?: string;
  className?: string;
  children: ReactElement;
  buttonClassNames?: string;
  showLockIcon?: boolean;
}

/**
 * Higher-order component that wraps UI elements requiring premium access.
 * Displays a premium feature modal when clicked if user is not authenticated.
 */
export function WithPremiumFeature({
  children,
  featureName,
  description,
  className = "",
  buttonClassNames = "",
  showLockIcon = true
}: WithPremiumFeatureProps) {
  const { user, status } = useAuth();
  const [modalOpen, setModalOpen] = useState(false);
  
  // Check if user is authenticated
  const isAuthenticated = status === "authenticated" && user !== null;
  
  // For authenticated users, just render the children
  if (isAuthenticated) {
    return children;
  }

  // For unauthenticated users, replace children with a wrapper that shows the premium modal
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setModalOpen(true);
  };
  
  // Clone the child element with modified props
  const wrappedChild = React.cloneElement(children, {
    onClick: handleClick,
    className: `${children.props.className || ""} ${buttonClassNames}`,
    // Disable it so actual onClick doesn't fire
    disabled: true,
  });
  
  return (
    <>
      <div className={`relative group ${className}`}>
        {/* Show a lock overlay on hover */}
        {showLockIcon && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -right-2 -top-2 bg-amber-500 rounded-full p-1 shadow-md z-10 text-white">
            <FaLock size={10} />
          </div>
        )}
        
        {/* The actual component with modified click behavior */}
        {wrappedChild}
      </div>
      
      {/* Premium Feature Modal */}
      <PremiumFeatureModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        featureName={featureName}
        description={description}
      />
    </>
  );
}

/**
 * Custom hook for premium features that returns a wrapped version
 * of any component that requires premium access
 */
export function usePremiumFeature() {
  const { user, status } = useAuth();
  
  // Function to wrap a component/element with premium feature protection
  const wrapWithPremium = (
    element: ReactElement,
    options: Omit<WithPremiumFeatureProps, 'children'> 
  ) => {
    return (
      <WithPremiumFeature {...options}>
        {element}
      </WithPremiumFeature>
    );
  };
  
  // Check if user is authenticated
  const isAuthenticated = status === "authenticated" && user !== null;
  
  return {
    wrapWithPremium,
    isAuthenticated
  };
}

/**
 * HOC to wrap entire components with premium feature protection
 */
export function withPremiumFeature<P extends object>(
  Component: ComponentType<P>,
  options: Omit<WithPremiumFeatureProps, 'children'>
) {
  return function WrappedComponent(props: P) {
    return (
      <WithPremiumFeature {...options}>
        <Component {...props} />
      </WithPremiumFeature>
    );
  };
}
