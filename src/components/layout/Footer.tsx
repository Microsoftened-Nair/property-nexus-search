
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-navy-800 text-white py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Property Nexus</h3>
            <p className="text-navy-100 mb-4">
              A unified property search platform providing access to multiple government databases.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-navy-100 hover:text-white transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/search" className="text-navy-100 hover:text-white transition-colors">
                  Advanced Search
                </a>
              </li>
              <li>
                <a href="/dashboard" className="text-navy-100 hover:text-white transition-colors">
                  Dashboard
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-navy-100 hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-navy-100 hover:text-white transition-colors">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-navy-100 hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-navy-100 hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-navy-700 mt-8 pt-6 text-center text-navy-100">
          <p>© 2025 Property Nexus. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
