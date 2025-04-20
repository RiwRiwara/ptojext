"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import { FaGithub } from "react-icons/fa";

export default function SupportUs() {
  return (
    <BaseLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 min-h-screen bg-gradient-to-br from-white to-blue-50">
        <div className="max-w-2xl mx-auto mb-4">
          <Breadcrumb items={[
            { label: "Home", href: "/" },
            { label: "Support Us" }
          ]} />
        </div>
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md border border-blue-100 p-6 text-center">
          <h1 className="text-3xl font-bold text-blue-800 mb-4">Support Us</h1>
          <p className="mb-6 text-gray-700 text-lg">
            If you enjoy this AI Interactive Playground and want to help us grow, consider supporting us!
          </p>
          <a
            href="https://github.com/sponsors/RiwRiwara"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white font-semibold rounded-lg shadow transition-colors text-lg"
          >
            <FaGithub className="text-2xl" />
            Donate via GitHub Sponsors
          </a>
          <div className="mt-8 text-gray-500 text-sm">
            Your donation will help us create more educational content and improve this platform. Thank you for your support!
          </div>
        </div>
      </div>
    </BaseLayout>
  );
}
