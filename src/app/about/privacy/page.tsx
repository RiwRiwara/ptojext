"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import { motion } from "framer-motion";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";

export default function PrivacyPolicy() {
  return (
    <BaseLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Breadcrumb items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Privacy Policy" }
            ]} />
          </div>

          {/* Header section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl mb-12 bg-gradient-to-r from-[#83AFC9] to-sky-600 text-white"
          >
            <div className="absolute inset-0 bg-pattern opacity-10" />
            <div className="relative z-10 px-8 py-12 text-center">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                Privacy Policy
              </h1>
              <p className="text-lg max-w-3xl mx-auto opacity-90">
                How we handle your information
              </p>
            </div>
          </motion.div>

          {/* Content container */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden z-10 relative p-8"
          >
            <div className="prose prose-lg max-w-none">
              <h2>Introduction</h2>
              <p>
                At Visual Right: AI Playground, we respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and safeguard your information when you use our website.
              </p>

              <h2>Information We Collect</h2>
              <p>
                We collect information that you provide directly to us, such as when you create an account, subscribe to our newsletter, or contact us. This may include:
              </p>
              <ul>
                <li>Name and contact information</li>
                <li>Account credentials</li>
                <li>Preferences and settings</li>
                <li>Feedback and correspondence</li>
              </ul>

              <p>
                We also automatically collect certain information when you visit our website, including:
              </p>
              <ul>
                <li>Usage data (pages visited, time spent)</li>
                <li>Device information (browser type, operating system)</li>
                <li>IP address and location data</li>
                <li>Cookies and similar technologies</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>
                We use the information we collect to:
              </p>
              <ul>
                <li>Provide, maintain, and improve our services</li>
                <li>Process transactions and send related information</li>
                <li>Send administrative messages and updates</li>
                <li>Respond to your comments and questions</li>
                <li>Understand how users interact with our website</li>
                <li>Personalize your experience</li>
                <li>Protect against fraud and abuse</li>
              </ul>

              <h2>Data Sharing and Disclosure</h2>
              <p>
                We do not sell your personal information. We may share your information with:
              </p>
              <ul>
                <li>Service providers who perform services on our behalf</li>
                <li>Partners with whom we offer co-branded services</li>
                <li>Law enforcement or other parties when required by law</li>
                <li>Other parties with your consent</li>
              </ul>

              <h2>Your Rights and Choices</h2>
              <p>
                Depending on your location, you may have certain rights regarding your personal information, including:
              </p>
              <ul>
                <li>Access to your personal data</li>
                <li>Correction of inaccurate data</li>
                <li>Deletion of your data</li>
                <li>Restriction of processing</li>
                <li>Data portability</li>
                <li>Objection to processing</li>
              </ul>

              <h2>Security</h2>
              <p>
                We implement appropriate technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, and destruction.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.
              </p>

              <h2>Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <a href="mailto:contact@visualright.ai" className="text-[#83AFC9] hover:underline">contact@visualright.ai</a>
              </p>

              <p className="text-gray-500 mt-8">
                Last updated: May 1, 2025
              </p>
            </div>
          </motion.div>
        </div>
      </div>
      
      <BottomComponent />
    </BaseLayout>
  );
}
