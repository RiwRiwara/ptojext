"use client";

import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <div className="mb-8">
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
        {title}
      </h1>
      {description && (
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {description}
        </p>
      )}
    </div>
  );
};
