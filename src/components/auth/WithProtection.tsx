"use client";
import React, { ReactNode, ForwardRefExoticComponent, RefAttributes } from "react";
import { ProtectedComponent, ProtectedComponentProps } from "./ProtectedComponent";

/**
 * Higher-order component (HOC) that wraps any component with authentication protection
 * 
 * @param Component The component to protect
 * @param options Protection options including custom messages
 * @returns A protected version of the component
 */
export function withProtection<P extends object>(
  Component: React.ComponentType<P>,
  options: Omit<ProtectedComponentProps, "children"> = {}
) {
  // Return a new component that wraps the original with protection
  const ProtectedWrapper = (props: P) => {
    return (
      <ProtectedComponent
        title={options.title}
        message={options.message}
        featureName={options.featureName}
        requiresAdmin={options.requiresAdmin}
      >
        <Component {...props} />
      </ProtectedComponent>
    );
  };
  
  // Set display name for debugging
  ProtectedWrapper.displayName = `withProtection(${
    Component.displayName || Component.name || "Component"
  })`;
  
  return ProtectedWrapper as ForwardRefExoticComponent<P & RefAttributes<unknown>>;
}

/**
 * HOC specifically for protecting premium features
 */
export function withPremiumProtection<P extends object>(Component: React.ComponentType<P>) {
  return withProtection(Component, {
    title: "Premium Feature",
    message: "This advanced feature is available for premium users only. Please sign in to your premium account to use AI detection.",
    featureName: "premium features"
  });
}

/**
 * HOC specifically for protecting admin features
 */
export function withAdminProtection<P extends object>(Component: React.ComponentType<P>) {
  return withProtection(Component, {
    title: "Admin Access Required",
    message: "This feature is restricted to administrators. Please sign in with your admin account to access it.",
    featureName: "admin tools",
    requiresAdmin: true
  });
}
