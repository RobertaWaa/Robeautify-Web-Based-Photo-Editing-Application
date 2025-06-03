import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Privacy Policy</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Introduction</h2>
        <p className="mb-4">
          Welcome to Robeautify ("we," "our," or "us"). We are committed to protecting your privacy and personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our photo editing application and website (the "Service").
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Information We Collect</h2>
        <p className="mb-4">We collect the following types of information:</p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">2.1 Personal Information You Provide:</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Account information (name, email address, password)</li>
          <li>Contact information when you communicate with us</li>
          <li>Information you provide in your user profile</li>
        </ul>
        
        <h3 className="text-xl font-medium mt-4 mb-2">2.2 Photos and Content:</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Photos you upload to our Service for editing</li>
          <li>Edited photos you save to your account</li>
        </ul>
        
        <h3 className="text-xl font-medium mt-4 mb-2">2.3 Automatically Collected Information:</h3>
        <ul className="list-disc pl-6 mb-4">
          <li>Usage data (features used, time spent, actions taken)</li>
          <li>Device information (device type, operating system, browser type)</li>
          <li>Log data and cookies</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">3. How We Use Your Information</h2>
        <p className="mb-4">We use the collected information for various purposes:</p>
        <ul className="list-disc pl-6 mb-4">
          <li>To provide and maintain our Service</li>
          <li>To process and save your edited photos</li>
          <li>To create and maintain your account</li>
          <li>To communicate with you and respond to inquiries</li>
          <li>To improve our Service and develop new features</li>
          <li>To detect and prevent fraud or unauthorized access</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. Photo Privacy and Storage</h2>
        <p className="mb-4">
          <strong>Your photos are private.</strong> We do not view, share, or sell your uploaded or edited photos without your explicit permission. Your photos are stored securely and are only accessible by you through your account. We do not use your photos for training algorithms or for any purpose other than providing the Service to you.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Data Security</h2>
        <p className="mb-4">
          We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your personal information, we cannot guarantee its absolute security.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Data Retention</h2>
        <p className="mb-4">
          We retain your personal information and edited photos for as long as your account is active or as needed to provide you with our Service. You can request deletion of your account and associated data at any time.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Third-Party Services</h2>
        <p className="mb-4">
          Our Service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these third-party services. We encourage you to read the privacy policies of any third-party service that you visit or use.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">8. Children's Privacy</h2>
        <p className="mb-4">
          Our Service is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If we discover that a child under 13 has provided us with personal information, we will delete such information from our servers.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">9. Changes to This Privacy Policy</h2>
        <p className="mb-4">
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically for any changes.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">10. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Email: robeautify@gmail.com</li>
          <li>Phone: +40 123 456 789</li>
          <li>Address: Bucharest, Romania</li>
        </ul>
      </div>
    </div>
  );
};

export default PrivacyPolicy;