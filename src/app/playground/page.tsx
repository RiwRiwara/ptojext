"use client";
import React from 'react';
import BaseLayout from '@/components/layout/BaseLayout';
import BottomComponent from '@/components/page_components/landing_page/BottomComponent';
import Breadcrumb from '@/components/common/Breadcrumb';
import { FlowEditor } from '@/components/playground_components/image_processing/flow_editor/FlowEditor';

export default function PlaygroundPage() {
  return (
    <BaseLayout>
        <div className="container mx-auto  py-6 px-4">
          <div className="mb-6">
            <Breadcrumb items={[
              { label: 'Home', href: '/' },
              { label: 'Playground', href: '/playground' },
              { label: 'Image Processing', href: '/playground/image-processing' },
            ]} />
            <h1 className="text-2xl font-bold text-gray-800 mt-4">Image Processing Playground</h1>
            <p className="text-gray-600">Build your own image processing workflow by dragging and connecting nodes</p>
          </div>
          
          {/* Image Processing Flow Editor */}
          <FlowEditor />
        </div>
      <BottomComponent />
    </BaseLayout>
  );
}
