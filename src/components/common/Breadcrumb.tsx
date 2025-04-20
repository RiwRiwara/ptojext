"use client";
import Link from "next/link";
import React from "react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items, className }) => {
  return (
    <nav className={`flex items-center text-sm text-gray-500 gap-2 ${className ?? ""}`} aria-label="Breadcrumb">
      {items.map((item, idx) => (
        <span key={item.href ?? item.label} className="flex items-center gap-1">
          {item.href && idx !== items.length - 1 ? (
            <Link href={item.href} className="hover:text-blue-700 underline underline-offset-2">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && <span className="mx-1 text-gray-300">/</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumb;
