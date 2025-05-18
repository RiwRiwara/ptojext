"use client";
import BaseLayout from "@/components/layout/BaseLayout";
import Breadcrumb from "@/components/common/Breadcrumb";
import { motion } from "framer-motion";
import BottomComponent from "@/components/page_components/landing_page/BottomComponent";

export default function TermsOfService() {
  return (
    <BaseLayout>
      <div className="py-12 px-4 sm:px-6 lg:px-8 relative min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Breadcrumb navigation */}
          <div className="mb-6">
            <Breadcrumb items={[
              { label: "Home", href: "/" },
              { label: "About", href: "/about" },
              { label: "Terms of Service" }
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
                Terms of Service
              </h1>
              <p className="text-lg max-w-3xl mx-auto opacity-90">
                Rules and guidelines for using our platform
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
              <h2>1. Acceptance of Terms</h2>
              <p>
                By accessing or using Visual Right: AI Playground, you agree to be bound by these Terms of Service. If you do not agree to all the terms and conditions, you may not access or use our services.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                Visual Right: AI Playground provides interactive educational tools, visualizations, and simulations related to AI algorithms and computer science concepts. Our services are designed for educational and informational purposes.
              </p>

              <h2>3. User Accounts</h2>
              <p>
                Some features of our platform may require you to create an account. You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to:
              </p>
              <ul>
                <li>Provide accurate and complete information when creating your account</li>
                <li>Update your information to keep it current</li>
                <li>Protect your account credentials</li>
                <li>Notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h2>4. User Conduct</h2>
              <p>
                When using our services, you agree not to:
              </p>
              <ul>
                <li>Violate any applicable laws or regulations</li>
                <li>Infringe upon the rights of others</li>
                <li>Use our services to distribute malware or harmful code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with or disrupt the integrity of our services</li>
                <li>Collect or store personal data about other users without their consent</li>
                <li>Use our services for any illegal or unauthorized purpose</li>
              </ul>

              <h2>5. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our services, including but not limited to text, graphics, logos, icons, images, audio clips, digital downloads, data compilations, and software, are the exclusive property of Visual Right: AI Playground or our licensors and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <p>
                You may use our services for personal, non-commercial purposes only. You may not modify, reproduce, distribute, create derivative works from, publicly display, or exploit our content without our explicit permission.
              </p>

              <h2>6. User Content</h2>
              <p>
                You retain ownership of any content you submit, post, or display on or through our services. By submitting content, you grant us a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, translate, and distribute your content in any existing or future media.
              </p>
              <p>
                You represent and warrant that you own or have the necessary rights to the content you submit and that your content does not violate the rights of any third party.
              </p>

              <h2>7. Disclaimer of Warranties</h2>
              <p>
                Our services are provided as is and as available without warranties of any kind, either express or implied. We do not guarantee that our services will be uninterrupted, secure, or error-free.
              </p>

              <h2>8. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, Visual Right: AI Playground shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use our services.
              </p>

              <h2>9. Changes to Terms</h2>
              <p>
                We may modify these Terms of Service at any time. We will notify you of any changes by posting the new terms on our website. Your continued use of our services after the changes have been posted constitutes your acceptance of the modified terms.
              </p>

              <h2>10. Governing Law</h2>
              <p>
                These Terms of Service shall be governed by and construed in accordance with the laws of Thailand, without regard to its conflict of law provisions.
              </p>

              <h2>11. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <p>
                <a href="mailto:contact@visualright.com" className="text-[#83AFC9] hover:underline">contact@visualright.com</a>
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
