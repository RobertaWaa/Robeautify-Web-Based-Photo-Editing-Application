import React from 'react';

const TermsOfService = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">Terms of Service</h1>
      
      <div className="prose prose-lg max-w-none">
        <p>Last updated: {new Date().toLocaleDateString()}</p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">1. Agreement to Terms</h2>
        <p className="mb-4">
          By accessing or using Robeautify's photo editing application and website (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access or use the Service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">2. Description of Service</h2>
        <p className="mb-4">
          Robeautify is a photo editing application that allows users to upload, edit, and save photos. Users can apply filters, make adjustments, crop, rotate, and perform other editing functions on their photos.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">3. User Accounts</h2>
        <p className="mb-4">
          When you create an account with us, you must provide accurate, complete, and current information. You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">4. User Content</h2>
        
        <h3 className="text-xl font-medium mt-4 mb-2">4.1 Content Ownership</h3>
        <p className="mb-4">
          You retain all rights to the photos you upload to our Service. By uploading photos to our Service, you grant us a limited license to store, process, and display your photos solely for the purpose of providing the Service to you.
        </p>
        
        <h3 className="text-xl font-medium mt-4 mb-2">4.2 Content Restrictions</h3>
        <p className="mb-4">
          You agree not to upload, edit, or share content that:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Infringes on the intellectual property rights of others</li>
          <li>Contains illegal, obscene, defamatory, threatening, or harassing content</li>
          <li>Contains viruses, malware, or other harmful code</li>
          <li>Violates any applicable laws or regulations</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">5. Acceptable Use</h2>
        <p className="mb-4">
          You agree to use the Service only for lawful purposes and in accordance with these Terms. You agree not to:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li>Use the Service in any way that could disable, overburden, or impair the Service</li>
          <li>Attempt to gain unauthorized access to any part of the Service</li>
          <li>Use any automated means to access or interact with the Service</li>
          <li>Attempt to reverse engineer or extract the source code of our software</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">6. Privacy Policy</h2>
        <p className="mb-4">
          Your use of the Service is also governed by our Privacy Policy, which is incorporated by reference into these Terms of Service. Please review our Privacy Policy to understand how we collect, use, and protect your information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">7. Intellectual Property</h2>
        <p className="mb-4">
          The Service and its original content (excluding user-provided content), features, and functionality are and will remain the exclusive property of Robeautify. The Service is protected by copyright, trademark, and other laws. Our trademarks and trade dress may not be used in connection with any product or service without our prior written consent.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">8. Termination</h2>
        <p className="mb-4">
          We may terminate or suspend your account and access to the Service immediately, without prior notice or liability, for any reason whatsoever, including but not limited to a breach of these Terms. Upon termination, your right to use the Service will immediately cease.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">9. Limitation of Liability</h2>
        <p className="mb-4">
          In no event shall Robeautify be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the Service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">10. Disclaimer</h2>
        <p className="mb-4">
          The Service is provided on an "AS IS" and "AS AVAILABLE" basis. Robeautify expressly disclaims all warranties of any kind, whether express or implied, including but not limited to the implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">11. Governing Law</h2>
        <p className="mb-4">
          These Terms shall be governed by and construed in accordance with the laws of Romania, without regard to its conflict of law provisions.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">12. Changes to Terms</h2>
        <p className="mb-4">
          We reserve the right to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.
        </p>
        
        <h2 className="text-2xl font-semibold mt-6 mb-3">13. Contact Us</h2>
        <p className="mb-4">
          If you have any questions about these Terms, please contact us at:
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

export default TermsOfService;