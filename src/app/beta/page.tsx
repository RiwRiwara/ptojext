"use client"; // Mark as Client Component

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiPieChart, FiCpu, FiImage, FiZap, FiLayers, FiBox, FiStar, FiExternalLink, FiCode, FiX } from 'react-icons/fi';
import BaseLayout from '@/components/layout/BaseLayout';

// Define interfaces for type safety
interface BetaFeature {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  badge: string;
  dateAdded: string;
  status: 'alpha' | 'beta' | 'stable';
  url?: string; // URL to navigate to or load in iframe
  displayMode?: 'iframe' | 'component' | 'redirect'; // How to display the feature
  previewImage?: string; // URL to the preview image
}

// Beta features data
const betaFeatures: BetaFeature[] = [
  {
    id: 'kmeanclus',
    title: 'K-means Clustering',
    description: 'Explore k-means clustering with interactive visualizations and performance metrics.',
    icon: FiPieChart,
    badge: 'New',
    dateAdded: 'May 15, 2025',
    status: 'alpha',
    url: '/page/kmeanclus',
    displayMode: 'iframe',
    previewImage: '/images/previews/kmean.png'
  },
  {
    id: 'ameba',
    title: 'Ameba',
    description: 'Explore Ameba with interactive visualizations and performance metrics.',
    icon: FiCpu,
    badge: 'Experimental',
    dateAdded: 'April 28, 2025',
    status: 'beta',
    url: '/page/ameba',
    displayMode: 'iframe',
    previewImage: '/images/previews/ameba.png'
  },
  {
    id: 'data-test',
    title: 'Data-Test',
    description: 'Explore Data-Test with interactive visualizations and performance metrics.',
    icon: FiLayers,
    badge: 'Stable',
    dateAdded: 'April 15, 2025',
    status: 'beta',
    url: '/page/data-test',
    displayMode: 'component',
    previewImage: '/images/previews/data-test.png'
  }
];

// Badge component
const Badge = ({ text, status }: { text: string; status: BetaFeature['status'] }) => {
  const getColor = (status: BetaFeature['status']) => {
    switch (status) {
      case 'alpha':
        return 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'beta':
        return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'stable':
        return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
    }
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full border ${getColor(status)}`}>
      {text}
    </span>
  );
};

// Feature card component
const FeatureCard = ({ feature, onClick }: { feature: BetaFeature; onClick: () => void }) => {
  const IconComponent = feature.icon;

  return (
    <motion.div 
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative group rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm transition-all hover:shadow-md dark:bg-gray-900 dark:border-gray-800 cursor-pointer flex flex-col"
      role="article"
      aria-labelledby={`feature-${feature.id}`}
      onClick={onClick}
    >
      {/* Preview Image */}
      <div className="w-full h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
        {feature.previewImage ? (
          <img 
            src={feature.previewImage} 
            alt={`${feature.title} preview`} 
            className="w-full h-full object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <IconComponent className="h-16 w-16 text-gray-400 dark:text-gray-600" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <Badge text={feature.badge} status={feature.status} />
        </div>
      </div>
      
      {/* Content */}
      <div className="p-5 flex-grow flex flex-col">
        <h3 id={`feature-${feature.id}`} className="text-lg font-semibold mb-2 text-gray-900 dark:text-white">
          {feature.title}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">{feature.description}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-gray-800">
          <time dateTime={feature.dateAdded}>Added: {feature.dateAdded}</time>
          <span className="flex items-center group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <FiExternalLink className="inline mr-1" />
            <span>Explore</span>
          </span>
        </div>
      </div>
    </motion.div>
  );
};

// Enhanced modal component with multiple display options
const FeatureModal = ({ feature, onClose }: { feature: BetaFeature | null; onClose: () => void }) => {
  // State for content loading and error handling - must be declared before any conditional returns
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  
  // Return null after hook declarations
  if (!feature) return null;
  
  // Render content based on display mode
  const renderContent = () => {
    if (!feature.url) {
      return <div className="p-8 text-center">No content available for this feature yet.</div>;
    }
    
    switch (feature.displayMode) {
      case 'iframe':
        return (
          <div className="relative w-full h-full">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}
            <iframe
              src={feature.url}
              className="w-full h-full rounded-lg border-0"
              title={feature.title}
              sandbox="allow-scripts allow-same-origin allow-forms"
              onLoad={() => setIsLoading(false)}
              onError={() => { setLoadError(true); setIsLoading(false); }}
            />
            {loadError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800">
                <div className="text-red-500 text-center p-4">
                  <p className="text-lg font-bold">Failed to load content</p>
                  <button 
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    onClick={() => window.open(feature.url, '_blank')}
                  >
                    Open in New Tab
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      
      case 'component':
        // For custom component rendering
        return (
          <div className="p-8 flex flex-col items-center justify-center h-full">
            <div className="max-w-2xl w-full">
              <div className="bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg mb-8 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-2">Custom Component Preview</h3>
                <p className="text-blue-700 dark:text-blue-400">
                  This feature uses a custom component rendering system that allows for rich interactive experiences without iframe limitations.
                </p>
              </div>
              
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
                <h3 className="text-lg font-bold mb-4">{feature.title} - Interactive Demo</h3>
                <div className="bg-gray-100 dark:bg-gray-700 h-64 rounded-lg flex items-center justify-center">
                  <p className="text-gray-500 dark:text-gray-400 text-center p-4">
                    Custom component for {feature.title} would render here.
                    <br /><br />
                    <button
                      onClick={() => window.location.href = feature.url || '/'}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    >
                      Launch Full Experience
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'redirect':
      default:
        // For redirect, show a preview with a button to navigate
        return (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center p-8 max-w-2xl">
              <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
              <p className="mb-8 text-gray-600 dark:text-gray-300">{feature.description}</p>
              <button
                onClick={() => window.location.href = feature.url || '/'}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Open Feature
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      role="dialog"
      aria-labelledby={`modal-${feature.id}`}
      onClick={(e) => {
        // Close when clicking the backdrop
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white dark:bg-gray-900 rounded-xl w-11/12 md:w-3/4 lg:w-2/3 h-3/4 max-w-4xl relative flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center">
            {feature.previewImage ? (
              <div className="w-10 h-10 mr-3 rounded-lg overflow-hidden">
                <img 
                  src={feature.previewImage} 
                  alt={`${feature.title} thumbnail`} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="p-2 mr-3 rounded-lg bg-gray-100 dark:bg-gray-800">
                {feature.icon && <feature.icon className="h-6 w-6 text-gray-600 dark:text-gray-300" />}
              </div>
            )}
            <div>
              <h2 id={`modal-${feature.id}`} className="text-xl font-semibold text-gray-900 dark:text-white">
                {feature.title}
              </h2>
              <div className="flex items-center mt-1">
                <Badge text={feature.badge} status={feature.status} />
                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                  Added: {feature.dateAdded}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center">
            {feature.url && (
              <button
                onClick={() => window.open(feature.url, '_blank')}
                className="mr-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Open in new tab"
              >
                <FiExternalLink className="h-5 w-5 text-gray-600 dark:text-gray-300" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              aria-label="Close modal"
            >
              <FiX className="h-6 w-6 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
        <div className="flex-1 overflow-hidden">
          {renderContent()}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Error boundary as a functional component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  React.useEffect(() => {
    const errorHandler = (error: ErrorEvent) => {
      console.error('Error caught in ErrorBoundary:', error);
      setHasError(true);
    };
    window.addEventListener('error', errorHandler);
    return () => window.removeEventListener('error', errorHandler);
  }, []);

  if (hasError) {
    return <div>Error loading component. Please try again.</div>;
  }

  return <>{children}</>;
};

// Main page component
export default function BetaFeaturesPage() {
  const [selectedFeature, setSelectedFeature] = useState<BetaFeature | null>(null);

  if (!BaseLayout) {
    console.error('BaseLayout is undefined. Check the export in @/components/layout/BaseLayout');
    return <div>Error: Layout component not found</div>;
  }

  return (
    <ErrorBoundary>
      <BaseLayout>
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          {/* Header Section */}
          <header className="text-center mb-12">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400"
            >
              Beta Features
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto"
            >
              Explore our experimental features and provide feedback. These cutting-edge tools are under active development and may change based on user input.
            </motion.p>
          </header>
          
          {/* Features Grid */}
          <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            aria-label="Beta features list"
          >
            {betaFeatures.map((feature) => (
              <FeatureCard 
                key={feature.id} 
                feature={feature} 
                onClick={() => setSelectedFeature(feature)}
              />
            ))}
          </motion.section>
          
          {/* FAQ/Info Section */}
          <section className="mt-16 p-6 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">About Beta Features</h2>
            <p className="text-gray-600 dark:text-gray-300 mb infância-4">
              Our beta features showcase experimental technologies and visualizations that are still under development. 
              We welcome your feedback to help shape the future of these tools.
            </p>
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                <FiStar className="mr-1.5" /> Latest Updates
              </span>
              <span className="inline-flex items-center px-3 py-1 text-sm font-medium rounded-md bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                <FiCode className="mr-1.5" /> Experimental
              </span>
            </div>
          </section>
        </div>

        {/* Modal for selected feature */}
        <FeatureModal 
          feature={selectedFeature} 
          onClose={() => setSelectedFeature(null)} 
        />
      </BaseLayout>
    </ErrorBoundary>
  );
}